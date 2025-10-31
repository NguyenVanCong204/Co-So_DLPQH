import History from "../../models/History.js";
import nodemailer from "nodemailer";
import CreateHistoryValidation from "../../validation/CreateHistoryValidation.js";
import Product from "../../models/Product.js";

export const createHistory = async (req, res) => {
  try {
    const { user, cart } = req.body;
    const ids = Object.keys(cart);
    const products = await Product.getProductCart(ids);

    const err = CreateHistoryValidation(user, products, cart);
    if (Object.keys(err).length > 0) {
      return res.status(400).json({ errors: err });
    }

    if (!products.length) {
      return res
        .status(400)
        .json({ errors: { product: "Không tìm thấy sản phẩm" } });
    }
    const total = products.reduce((sum, p) => sum + p.price * cart[p._id], 0);

    console.log("📧 Gửi email đến:", user.email);
    await sendMailOrder(user, products, cart, total);

    await Promise.all(
      products.map((value) =>
        History.createHistory({
          email: user.email,
          phone: user.phone,
          name: value.name,
          price: value.price,
          id_user: user.id,
          qualty: cart[value.id],
        })
      )
    );
    return res.status(200).json({ message: "Đặt hàng thành công!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Đặt hàng thất bại" });
  }
};
const sendMailOrder = async (user, products, cart, total) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "congnguyenvan522@gmail.com",
      pass: "kyiwxbaszelhngsw", // dùng App Password
    },
  });

  const productHTML = products
    .map(
      (p) => `
      <tr>
        <td>${p.name}</td>
        <td>${p.price} VND</td>
        <td>${cart[p.id]}</td>
        <td>${p.price * cart[p.id]} VND</td>
      </tr>
    `
    )
    .join("");

  const html = `
  <h2>Xin chào ${user.name},</h2>
  <p>Cảm ơn bạn đã mua hàng. Dưới đây là thông tin đơn hàng của bạn:</p>
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
