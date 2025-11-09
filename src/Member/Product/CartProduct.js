import { useContext, useEffect, useState } from "react";
import apiMember from "../../API/apiMember";
import "./CartProduct.css"; 
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  addQualtyCart,
  removeQualtyCart,
} from "../../features/cart/Cart";
import MemberCartContext from "../../Context/MemberCartContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function formatPrice(price) {
  if (!price) return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function CartProduct() {
  let totallocal = useContext(MemberCartContext);
  const cartredux = useSelector((state) => state.cartredux);
  const dispatch = useDispatch();
  const [AllQualtyCart, SetAllQualtyCart] = useState(0);

  const [input, SetInput] = useState([]);
  useEffect(() => {
    let tongQualtyCart = 0;
    apiMember.post("/cart", cartredux).then((res) => {
      console.log(res.data);
      const products = Array.isArray(res.data.data) ? res.data.data : [];
      SetInput(products);
      products.map((value, index) => {
        tongQualtyCart += value.price * value.qty;
      });
      SetAllQualtyCart(tongQualtyCart);
    });
  }, [cartredux]);

  function removeQualtyCartProduct(id, qty) {
    if (qty > 1) { 
      dispatch(removeQualtyCart(id));
      if (totallocal.cart > 0) {
        totallocal.cart -= 1;
        totallocal.SetCart(totallocal.cart);
      }
    } else {
      toast.info("Số lượng sản phẩm tối thiểu là 1");
    }
  }
  
  function addQualtyCartProduct(id, qty) {
    dispatch(addQualtyCart(id));
    totallocal.cart += 1;
    totallocal.SetCart(totallocal.cart);
  }
  function removeFromCartProduct(id, qty) {
    dispatch(removeFromCart(id));
    totallocal.cart -= qty;
    totallocal.SetCart(totallocal.cart);
    toast.success("Xóa sản phẩm khỏi giỏ hàng thành công");
  }

  function renderData() {
    if (input.length === 0) {
      return (
        <tr>
          <td colSpan="6" style={{ textAlign: "center", padding: "30px" }}>
            Giỏ hàng của bạn đang trống.
          </td>
        </tr>
      );
    }

    return input.map((value, index) => {
      const avatar = JSON.parse(value.image);
      return (
        <tr key={index}>
          <td className="cart_product">
            <div className="product-info">
              <img src={`http://localhost:3001/${avatar[0]}`} alt={value.name} />
              <div>
                <Link to={`/member/home/product/detail/${value._id}`}>
                  {value.name}
                </Link>
              </div>
            </div>
          </td>
          <td className="cart_price">
            <p>{formatPrice(value.price)}</p>
          </td>
          <td className="cart_quantity">
            <div className="quantity-control">
              <button
                className="quantity-btn"
                onClick={() => removeQualtyCartProduct(value._id, value.qty)}
              >
                −
              </button>
              <input
                type="text"
                className="quantity-input"
                value={value.qty}
                readOnly
              />
              <button
                className="quantity-btn"
                onClick={() => addQualtyCartProduct(value._id, value.qty)}
              >
                +
              </button>
            </div>
          </td>
          <td className="cart_total">
            <p className="cart_price">
              {formatPrice(value.qty * value.price)}
            </p>
          </td>
          <td className="cart_delete">
            <a onClick={() => removeFromCartProduct(value._id, value.qty)}>
              <i className="fa fa-times" />
            </a>
          </td>
        </tr>
      );
    });
  }

  return (
    <section id="cart_items_new">

        <h2 className="cart_title">Giỏ Hàng Của Bạn</h2>

        <div className="row">
          <div className="col-md-12">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Sản Phẩm</th>
                  <th>Giá</th>
                  <th>Số Lượng</th>
                  <th>Tổng</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>{renderData()}</tbody>
            </table>
          </div>
        </div>

        <div className="row">
          <div className="col-md-5 pull-right">
            <div className="cart-total-box">
              <h3>TỔNG CỘNG</h3>
              <ul>
                <li>
                  Tạm tính <span>{formatPrice(AllQualtyCart)}</span>
                </li>
                <li>
                  Eco Tax <span>{formatPrice(2)}</span>
                </li>
                <li>
                  Phí Vận Chuyển <span>Free</span>
                </li>
                <li className="total">
                  Tổng <span>{formatPrice(AllQualtyCart + 2)}</span>
                </li>
              </ul>
              <Link to="/member/product/checkout" className="checkout-btn">
                Tiến hành thanh toán
              </Link>
            </div>
          </div>
        </div>
    </section>
  );
}
export default CartProduct;