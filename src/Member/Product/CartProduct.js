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

function CartProduct() {
  let totallocal = useContext(MemberCartContext);
  const cartredux = useSelector((state) => state.cartredux);
  const dispatch = useDispatch();
  const [AllQualtyCart, SetAllQualtyCart] = useState(0);

  const [input, SetInput] = useState([]);
  useEffect(() => {
    let tongQualtyCart = 0;
    apiMember
      .post("member/user/product/getproductcart", cartredux)
      .then((res) => {
        console.log(res.data);
        SetInput(res.data);
        res.data.map((value, index) => {
          tongQualtyCart += value.price * value.qty;
        });
        SetAllQualtyCart(tongQualtyCart);
      });
  }, [cartredux]);
  function removeQualtyCartProduct(id, qty) {
    dispatch(removeQualtyCart(id));
    if (qty > 0 && totallocal.cart > 0) {
      totallocal.cart -= 1;
      totallocal.SetCart(totallocal.cart);
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
    return input.map((value, index) => {
      const avatar = JSON.parse(value.image);
      return (
        <div className="cart" key={index}>
          <img src={`http://localhost:3001/${avatar[0]}`}></img>
          <div className="cart-left">
            <p>{value.name}</p>
            <p>{value.price} VND</p>
          </div>
          <div className="cart-right">
            <div className="quantity-container">
              <div className="quantity-label">Số Lượng</div>
              <div className="quantity-control">
                <button
                  className="quantity-btn"
                  onClick={() => removeQualtyCartProduct(value.id, value.qty)}
                >
                  −
                </button>
                <input
                  type="text"
                  className="quantity-input"
                  value={value.qty}
                  readonly
                />
                <button
                  className="quantity-btn"
                  onClick={() => addQualtyCartProduct(value.id, value.qty)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <button className="add">Xác nhận</button>
          <button
            onClick={() => removeFromCartProduct(value.id, value.qty)}
            className="delete-cart"
          >
            Xóa
          </button>
        </div>
      );
    });
  }
  return (
    <div className="cart_product">
      <h2 className="cart_title">Cart</h2>
      {renderData()}
      <section id="do_action">
        <div class="container">
          <div class="heading">
            <h3>What would you like to do next?</h3>
            <p>
              Choose if you have a discount code or reward points you want to
              use or would like to estimate your delivery cost.
            </p>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="chose_area">
                <ul class="user_option">
                  <li>
                    <input type="checkbox" />
                    <label>Use Coupon Code</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label>Use Gift Voucher</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label>Estimate Shipping & Taxes</label>
                  </li>
                </ul>
                <ul class="user_info">
                  <li class="single_field">
                    <label>Country:</label>
                    <select>
                      <option>United States</option>
                      <option>Bangladesh</option>
                      <option>UK</option>
                      <option>India</option>
                      <option>Pakistan</option>
                      <option>Ucrane</option>
                      <option>Canada</option>
                      <option>Dubai</option>
                    </select>
                  </li>
                  <li class="single_field">
                    <label>Region / State:</label>
                    <select>
                      <option>Select</option>
                      <option>Dhaka</option>
                      <option>London</option>
                      <option>Dillih</option>
                      <option>Lahore</option>
                      <option>Alaska</option>
                      <option>Canada</option>
                      <option>Dubai</option>
                    </select>
                  </li>
                  <li class="single_field zip-field">
                    <label>Zip Code:</label>
                    <input type="text" />
                  </li>
                </ul>
                <a class="btn btn-default update" href="">
                  Get Quotes
                </a>
                <a class="btn btn-default check_out" href="">
                  Continue
                </a>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="total_area">
                <ul>
                  <li>
                    Cart Sub Total{" "}
                    <span class="totalll">{AllQualtyCart} VND</span>
                  </li>
                  <li>
                    Eco Tax <span>2 VND</span>
                  </li>
                  <li>
                    Shipping Cost <span>Free</span>
                  </li>
                  <li>
                    Total <span class="totall">{AllQualtyCart + 2} VND</span>
                  </li>
                </ul>
                <a class="btn btn-default update" href="">
                  Update
                </a>
                <Link to="/member/product/checkout">
                  <a class="btn btn-default check_out" href="">
                    Check Out
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default CartProduct;
