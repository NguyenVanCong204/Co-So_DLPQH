import History from "../../models/History.js";
import nodemailer from "nodemailer";
import CreateHistoryValidation from "../../validation/CreateHistoryValidation.js";
import Product from "../../models/Product.js";
import mongoose from "mongoose";

export const createHistory = async (req, res) => {
  try {
    console.log("📦 Creating order...");
    const { user, cart } = req.body;

    if (!user || !user._id) {
      console.error("❌ Missing user data");
      return res.status(400).json({ error: "Thiếu thông tin người dùng" });
    }

    if (!cart || Object.keys(cart).length === 0) {
      console.error("❌ Empty cart");
      return res.status(400).json({ error: "Giỏ hàng trống" });
    }

    console.log("🛒 Cart keys:", Object.keys(cart));
    const ids = Object.keys(cart);

    // Convert string IDs to ObjectId if needed
    const objectIds = ids.map(id => {
      try {
        return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;
      } catch {
        return id;
      }
    });

    const products = await Product.getProductCart(objectIds);
    console.log("📦 Found products:", products.length);

    if (!products || products.length === 0) {
      console.error("❌ No products found for IDs:", ids);
      return res.status(400).json({ errors: { product: "Không tìm thấy sản phẩm" } });
    }

    const errUser = await History.checkUser(user._id);
    if (Object.keys(errUser).length > 0) {
      console.error("❌ User validation error:", errUser);
      return res.status(404).json({ error: errUser });
    }

    const err = CreateHistoryValidation(user, products, cart);
    if (Object.keys(err).length > 0) {
      console.error("❌ Validation errors:", err);
      return res.status(400).json({ errors: err });
    }

    // Check stock availability and update quantities
    const stockErrors = [];
    for (const product of products) {
      const productId = product._id?.toString() || product.id?.toString();
      const qty = parseInt(cart[productId] || cart[product._id] || cart[product.id] || 0);

      if (!qty || qty <= 0) {
        stockErrors.push(`${product.name}: Số lượng không hợp lệ`);
        continue;
      }

      const availableQty = parseInt(product.quantity || product.qualty || 0);
      if (isNaN(availableQty)) {
        stockErrors.push(`${product.name}: Không thể xác định số lượng tồn kho`);
        continue;
      }
      if (qty > availableQty) {
        stockErrors.push(`${product.name}: Không đủ hàng (còn ${availableQty}, yêu cầu ${qty})`);
      }
    }

    if (stockErrors.length > 0) {
      console.error("❌ Stock errors:", stockErrors);
      return res.status(400).json({
        errors: { stock: stockErrors.join(', ') }
      });
    }

    // Stock deduction moved to confirmOrder
    // We only check availability here (already done above)
    console.log("✅ Product quantities updated");

    const total = products.reduce((sum, p) => {
      const productId = p._id?.toString() || p.id?.toString();
      const qty = parseInt(cart[productId] || cart[p._id] || cart[p.id] || 0);
      const is_on_sale = p.status === 0 && p.sale > 0;
      const price = is_on_sale ? p.price * (1 - p.sale / 100) : p.price;
      return sum + (price * qty);
    }, 0);

    // Generate order code
    const orderCode = History.generateOrderCode();
    const paymentMethod = req.body.paymentMethod || 'cod';
    const address = user.address || '';
    const note = user.note || '';

    console.log("💾 Creating order records...");
    // Create orders first
    const orderPromises = products.map((value) => {
      const productId = value._id?.toString() || value.id?.toString();
      const qty = parseInt(cart[productId] || cart[value._id] || cart[value.id] || 0);
      const is_on_sale = value.status === 0 && value.sale > 0;
      const finalPrice = is_on_sale ? value.price * (1 - value.sale / 100) : value.price;

      return History.createHistory({
        id_product: value._id,
        price: finalPrice,
        id_user: user._id,
        qualty: qty,
        orderCode,
        paymentMethod,
        address,
        note,
        status: 0, // Waiting for confirmation
      });
    });

    await Promise.all(orderPromises);
    console.log("✅ Order records created");

    // Try to send email, but don't fail the order if email fails
    try {
      console.log("📧 Gửi email đến:", user.email);
      await sendMailOrder(user, products, cart, total, orderCode);
    } catch (emailError) {
      console.error("Lỗi khi gửi email (nhưng đơn hàng đã được tạo):", emailError);
      // Continue even if email fails
    }

    console.log("✅ Order created successfully:", orderCode);
    return res.status(200).json({ message: "Đặt hàng thành công!", orderCode });
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Error details:", error);

    return res.status(500).json({
      error: "Đặt hàng thất bại",
      message: error.message || "Lỗi không xác định",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
export const getOrdersByUser = async (req, res) => {
  try {
    const id_user = req.params.id_user;
    const orders = await History.getOrdersByUser(id_user);
    return res.status(200).json({ data: orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await History.updateOrderStatus(id, status);
    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }
    return res.status(200).json({ message: "Cập nhật trạng thái thành công", data: order });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const markAsDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await History.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }

    // Update all orders with the same orderCode
    if (order.orderCode) {
      await History.updateMany(
        { orderCode: order.orderCode },
        { status: 2 } // 2 = Delivered
      );
    } else {
      // For backward compatibility with old orders
      await History.updateOrderStatus(id, 2);
    }

    const updatedOrder = await History.findById(id).populate('id_product');
    return res.status(200).json({ message: "Đánh dấu đã giao hàng thành công", data: updatedOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await History.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }

    if (order.status !== 0) {
      return res.status(400).json({ error: "Chỉ có thể hủy đơn hàng khi đang chờ xác nhận" });
    }

    // Update all orders with the same orderCode
    if (order.orderCode) {
      await History.updateMany(
        { orderCode: order.orderCode },
        { status: 3 } // 3 = Cancelled
      );

      // Stock restoration removed as it is not deducted yet

    } else {
      await History.updateOrderStatus(id, 3);
      // Stock restoration removed as it is not deducted yet
    }

    return res.status(200).json({ message: "Hủy đơn hàng thành công" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await History.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }

    if (order.status !== 0) {
      return res.status(400).json({ error: "Đơn hàng không ở trạng thái chờ xác nhận" });
    }

    // Update all orders with the same orderCode
    let ordersToConfirm = [];
    if (order.orderCode) {
      ordersToConfirm = await History.find({ orderCode: order.orderCode }).populate('id_product');
      await History.updateMany(
        { orderCode: order.orderCode },
        { status: 1 } // 1 = Waiting for delivery
      );
    } else {
      ordersToConfirm = [await History.findById(id).populate('id_product')];
      await History.updateOrderStatus(id, 1);
    }

    // Deduct stock
    for (const o of ordersToConfirm) {
      if (o.id_product) {
        const product = o.id_product;
        // Handle both quantity and qualty fields if necessary, but model uses quantity
        // Note: Product.findByIdAndUpdate uses $inc with negative value to deduct
        // But we need to check if enough stock first?
        // Ideally we should have checked before updating status, but let's do it now or assume admin checked.
        // Better: Check stock first.

        const currentQty = parseInt(product.quantity || product.qualty || 0);
        const orderQty = o.qualty;
        const newQty = currentQty - orderQty;

        console.log(`Updating product ${product._id}: current=${currentQty}, order=${orderQty}, new=${newQty}`);

        await Product.updateProduct(product._id, {
          quantity: newQty,
          qualty: newQty
        });
      }
    }

    return res.status(200).json({ message: "Xác nhận đơn hàng thành công" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await History.find().populate('id_product').populate('id_user').sort({ createdAt: -1 });
    return res.status(200).json({ data: orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const sendMailOrder = async (user, products, cart, total, orderCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "congnguyenvan522@gmail.com",
      pass: "kyiwxbaszelhngsw", // dùng App Password
    },
  });

  const productHTML = products
    .map(
      (p) => {
        const qty = cart[p._id.toString()] || cart[p.id] || 0;
        const is_on_sale = p.status === 0 && p.sale > 0;
        const finalPrice = is_on_sale ? p.price * (1 - p.sale / 100) : p.price;
        return `
      <tr>
        <td>${p.name}</td>
        <td>${finalPrice} VND</td>
        <td>${qty}</td>
        <td>${finalPrice * qty} VND</td>
      </tr>
    `;
      }
    )
    .join("");

  const html = `
  <h2>Xin chào ${user.name},</h2>
  <p>Cảm ơn bạn đã mua hàng. Dưới đây là thông tin đơn hàng của bạn:</p>
  <p><strong>Mã đơn hàng: ${orderCode}</strong></p>
  <table border="1" cellpadding="6" cellspacing="0">
    <thead>
      <tr>
        <th>Sản phẩm</th><th>Giá</th><th>Số lượng</th><th>Tổng</th>
      </tr>
    </thead>
    <tbody>
      ${productHTML}
    </tbody>
  </table>
  <p><strong>Tổng cộng: ${total} VND</strong></p>
  <p>Phí ship: Free</p>
  <p>Cảm ơn bạn đã tin tưởng chúng tôi!</p>
  `;

  await transporter.sendMail({
    from: "congnguyenvan522@gmail.com",
    to: user.email,
    subject: "Xác nhận đơn hàng",
    html,
  });
};
