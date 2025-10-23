import { useContext, useEffect, useState } from "react";
import api from "../../API/api";
import { useSelector, useDispatch } from "react-redux";
import refershToken from "../RefershToken/RefershToken";
import {
  removeFromCart,
  addQualtyCart,
  removeQualtyCart,
} from "../../features/cart/Cart";
import MemberCartContext from "../../Context/MemberCartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CheckOut() {
  const token = localStorage.getItem("token");
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
  const navigate = useNavigate();
  let totallocal = useContext(MemberCartContext);
  const cart = useSelector((state) => state.cartredux);
  const dispatch = useDispatch();
  const [AllQualtyCart, SetAllQualtyCart] = useState(0);
  const [input, SetInput] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    let tongQualtyCart = 0;
    api.post("member/user/product/getproductcart", cart).then((res) => {
      console.log(res.data);
      SetInput(res.data);
      res.data.map((value, index) => {
        tongQualtyCart += value.price * value.qty;
      });
      SetAllQualtyCart(tongQualtyCart);
    });
  }, [cart]);
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
  function RenderData() {
    return input.map((value, index) => {
      const avatar = JSON.parse(value.image);
      return (
        <tr>
          <td className="cart_product">
            <a href>
              <img src={`http://localhost:3001/${avatar[0]}`} alt="" />
            </a>
          </td>
          <td className="cart_description">
            <h4>
              <a href>{value.name}</a>
            </h4>
            <p>Web ID: {value.id}</p>
          </td>
          <td className="cart_price">
            <p>{value.price} VND</p>
          </td>
          <td className="cart_quantity">
            <div className="cart_quantity_button">
              <a
                className="cart_quantity_up"
                href
                onClick={() => addQualtyCartProduct(value.id, value.qty)}
              >
                {" "}
                +{" "}
              </a>
              <input
                className="cart_quantity_input"
                type="text"
                name="quantity"
                value={value.qty}
                autoComplete="off"
                size={2}
              />
              <a
                className="cart_quantity_down"
                href
                onClick={() => removeQualtyCartProduct(value.id, value.qty)}
              >
                {" "}
                -{" "}
              </a>
            </div>
          </td>
          <td className="cart_total">
            <p className="cart_total_price">{value.qty * value.price} VND</p>
          </td>
          <td className="cart_delete">
            <a
              className="cart_quantity_delete"
              href
              onClick={() => removeFromCartProduct(value.id, value.qty)}
            >
              <i className="fa fa-times" />
            </a>
          </td>
        </tr>
      );
    });
  }
  function Order() {
    api
      .post("member/user/product/order", { user, cart }, config)
      .then((res) => {
        toast.success(res.data.message);
        navigate("/member/home");
      })
      .catch(async (error) => {
        if (error && error.response && error.response.status == 401) {
          const tokenNew = await refershToken();
          try {
            let config = {
              headers: {
                Authorization: `Bearer ${tokenNew}`,
                Accept: "application/json",
              },
            };
            api
              .post("member/user/product/order", { user, cart }, config)
              .then((res) => {
                toast.success(res.data.message + "sau khi refesh token");
                navigate("/member/home");
              })
              .catch((error) => {
                if (
                  error &&
                  error.response &&
                  error.response.data &&
                  error.response.data.error
                ) {
                  console.log(error.response.data && error.response.data.error);
                } else {
                  console.log(error);
                }
              });
          } catch (error) {
            toast.error("Lỗi khi làm mới token. Vui lòng đăng nhập lại.");
            console.error(error);
          }
        } else {
          if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            console.log(error.response.data.errors);
          }
        }
      });
  }
  return (
    <section id="cart_items">
      <div className="container">
        <div className="breadcrumbs">
          <ol className="breadcrumb">
            <li>
              <a href="#">Home</a>
            </li>
            <li className="active">Check out</li>
          </ol>
        </div>
        {/*/breadcrums*/}
        <div className="step-one">
          <h2 className="heading">Step1</h2>
        </div>
        <div className="checkout-options">
          <h3>New User</h3>
          <p>Checkout options</p>
          <ul className="nav">
            <li>
              <label>
                <input type="checkbox" /> Register Account
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" /> Guest Checkout
              </label>
            </li>
            <li>
              <a href>
                <i className="fa fa-times" />
                Cancel
              </a>
            </li>
          </ul>
        </div>
        {/*/checkout-options*/}
        <div className="register-req">
          <p>
            Please use Register And Checkout to easily get access to your order
            history, or use Checkout as Guest
          </p>
        </div>
        {/*/register-req*/}
        <div className="shopper-informations">
          <div className="row">
            <div className="col-sm-3">
              <div className="shopper-info">
                <p>Shopper Information</p>
                <form>
                  <input type="text" placeholder="Display Name" />
                  <input type="text" placeholder="User Name" />
                  <input type="password" placeholder="Password" />
                  <input type="password" placeholder="Confirm password" />
                </form>
                <a className="btn btn-primary" href>
                  Get Quotes
                </a>
                <a className="btn btn-primary" href>
                  Continue
                </a>
              </div>
            </div>
            <div className="col-sm-5 clearfix">
              <div className="bill-to">
                <p>Bill To</p>
                <div className="form-one">
                  <form>
                    <input type="text" placeholder="Company Name" />
                    <input type="text" placeholder="Email*" />
                    <input type="text" placeholder="Title" />
                    <input type="text" placeholder="First Name *" />
                    <input type="text" placeholder="Middle Name" />
                    <input type="text" placeholder="Last Name *" />
                    <input type="text" placeholder="Address 1 *" />
                    <input type="text" placeholder="Address 2" />
                  </form>
                </div>
                <div className="form-two">
                  <form>
                    <input type="text" placeholder="Zip / Postal Code *" />
                    <select>
                      <option>-- Country --</option>
                      <option>United States</option>
                      <option>Bangladesh</option>
                      <option>UK</option>
                      <option>India</option>
                      <option>Pakistan</option>
                      <option>Ucrane</option>
                      <option>Canada</option>
                      <option>Dubai</option>
                    </select>
                    <select>
                      <option>-- State / Province / Region --</option>
                      <option>United States</option>
                      <option>Bangladesh</option>
                      <option>UK</option>
                      <option>India</option>
                      <option>Pakistan</option>
                      <option>Ucrane</option>
                      <option>Canada</option>
                      <option>Dubai</option>
                    </select>
                    <input type="password" placeholder="Confirm password" />
                    <input type="text" placeholder="Phone *" />
                    <input type="text" placeholder="Mobile Phone" />
                    <input type="text" placeholder="Fax" />
                  </form>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="order-message">
                <p>Shipping Order</p>
                <textarea
                  name="message"
                  placeholder="Notes about your order, Special Notes for Delivery"
                  rows={16}
                  defaultValue={""}
                />
                <label>
                  <input type="checkbox" /> Shipping to bill address
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="review-payment">
          <h2>Review &amp; Payment</h2>
        </div>
        <div className="table-responsive cart_info">
          <table className="table table-condensed">
            <thead>
              <tr className="cart_menu">
                <td className="image">Item</td>
                <td className="description" />
                <td className="price">Price</td>
                <td className="quantity">Quantity</td>
                <td className="total">Total</td>
                <td />
              </tr>
            </thead>
            <tbody>
              {RenderData()}

              <tr>
                <td colSpan={4}>&nbsp;</td>
                <td colSpan={2}>
                  <table className="table table-condensed total-result">
                    <tbody>
                      <tr>
                        <td>Cart Sub Total</td>
                        <td>{AllQualtyCart} VND</td>
                      </tr>
                      <tr>
                        <td>Exo Tax</td>
                        <td>2 VND</td>
                      </tr>
                      <tr className="shipping-cost">
                        <td>Shipping Cost</td>
                        <td>Free</td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>
                          <span>{AllQualtyCart + 2} VND</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <button className="order" onClick={() => Order()}>
                    Order
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="payment-options">
          <span>
            <label>
              <input type="checkbox" /> Direct Bank Transfer
            </label>
          </span>
          <span>
            <label>
              <input type="checkbox" /> Check Payment
            </label>
          </span>
          <span>
            <label>
              <input type="checkbox" /> Paypal
            </label>
          </span>
        </div>
      </div>
    </section>
  );
}
export default CheckOut;
