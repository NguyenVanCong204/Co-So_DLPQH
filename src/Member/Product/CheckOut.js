import { useContext, useEffect, useState } from "react";
import apiMember from "../../API/apiMember";
import { resetCartRedux } from "../../features/cart/Cart";
import { resetCartSlider } from "../../features/cart/CartSlider";
import { useSelector, useDispatch } from "react-redux";
import refershToken from "../../RefershToken/RefershToken";
import MemberCartContext from "../../Context/MemberCartContext";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "./CheckOut.css";

function formatPrice(price) {
  if (!price) return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function CheckOut() {
  const token = localStorage.getItem("token");
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
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
  const [countryName, setCountryName] = useState("");

  useEffect(() => {
    let tongQualtyCart = 0;
    apiMember.post("/cart", cart).then((res) => {
      const products = Array.isArray(res.data.data) ? res.data.data : [];
      SetInput(products);
      products.map((value, index) => {
        tongQualtyCart += value.price * value.qty;
      });
      SetAllQualtyCart(tongQualtyCart);
    });

    if (user && user.id_country) {
      apiMember
        .get(`/country/${user.id_country}`)
        .then((res) => {
          setCountryName(res.data.name);
        })
        .catch((err) => {
          console.error("Không thể lấy tên quốc gia:", err);
          setCountryName("Không rõ");
        });
    }
  }, [cart, user]);

  function RenderData() {
    if (input.length === 0) {
      return (
        <tr>
          <td colSpan="5" style={{ textAlign: "center", padding: "30px" }}>
            Không có sản phẩm nào để thanh toán.
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
            <div className="cart_quantity_button">
              <span>{value.qty}</span>
            </div>
          </td>
          <td className="cart_total">
            <p className="cart_price">
              {formatPrice(value.qty * value.price)}
            </p>
          </td>
        </tr>
      );
    });
  }

  function Order() {
    if (user) {
      if (Object.keys(cart).length > 0) {
        console.log(user);
        console.log(cart);
        apiMember
          .post("/order", { user, cart }, config)
          .then((res) => {
            toast.success(res.data.message);
            localStorage.removeItem("cart");
            localStorage.removeItem("total");
            totallocal.SetCart(0);
            
            dispatch(resetCartRedux());
            dispatch(resetCartSlider());
            // -----------------------
            
            navigate("/member/home");
          })
          .catch(async (error) => {
            if (error.response) {
              const status = error.response.status;
              const message =
                error.response.data?.error ||
                error.response.data?.message ||
                error.message;
              if (status == 401) {
                try {
                  const newtoken = await refershToken();
                  if (!newtoken) {
                    return toast.error(
                      "Không thể làm mới token. Vui lòng đăng nhập lại."
                    );
                  }
                  let config = {
                    headers: {
                      Authorization: `Bearer ${newtoken}`,
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    },
                  };
                  const res2 = await apiMember.post(
                    "/order",
                    { user, cart },
                    config
                  );
                  console.log(res2);
                  toast.success(res2.data.data.message);
                  localStorage.removeItem("cart");
                  localStorage.removeItem("total");
                  totallocal.SetCart(0);

                  dispatch(resetCartRedux());
                  dispatch(resetCartSlider());

                  navigate("/member/home");
                } catch (refreshError) {
                  toast.error("Lỗi khi làm mới token. Vui lòng đăng nhập lại.");
                  console.error(refreshError);
                }
              } else if (status === 403) {
                toast.error(message);
              } else {
                if (typeof message === "object" && message !== null) {
                  const keys = Object.keys(message);
                  if (keys.length > 0) {
                    const firstKey = keys[0];
                    toast.error("Lỗi khi đặt hàng: " + message[firstKey]);
                  }
                } else {
                  toast.error("Lỗi khi đặt hàng: " + message);
                }
              }
            } else {
              toast.error("Không thể kết nối đến server: " + error.message);
            }
          });
      } else {
        toast.warn("Vui lòng thêm sản phẩm vào giỏ hàng");
      }
    } else {
      toast.warn("Vui lòng đăng nhập");
      navigate("/");
    }
  }

  return (
    <section className="checkout-page">
      <h2 className="checkout-title">Thanh Toán Đơn Hàng</h2>

      <div className="row">
        <div className="col-md-8">
          <div className="checkout-box">
            <h3>1. Kiểm tra lại sản phẩm</h3>
            <div className="table-responsive cart_info">
              <table className="table cart-table">
                <thead>
                  <tr className="cart_menu">
                    <td className="image">Sản Phẩm</td>
                    <td className="price">Giá</td>
                    <td className="quantity">Số Lượng</td>
                    <td className="total">Tổng</td>
                  </tr>
                </thead>
                <tbody>{RenderData()}</tbody>
              </table>
            </div>
          </div>

          <div className="cart-total-box">
            <h3>3. Tổng Thanh Toán</h3>
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
          </div>
        </div>

        <div className="col-md-4">
          <div className="checkout-box user-info-box">
            <h3>2. Thông tin giao hàng</h3>
            {user ? (
              <ul>
                <li>
                  <strong>Họ Tên:</strong> {user.name}
                </li>
                <li>
                  <strong>Email:</strong> {user.email}
                </li>
                <li>
                  <strong>Phone:</strong> {user.phone}
                </li>
                <li>
                  <strong>Địa chỉ:</strong> {user.address}
                </li>
                <li>
                  <strong>Quốc gia:</strong> {countryName}
                </li>
              </ul>
            ) : (
              <p>Vui lòng đăng nhập để thấy thông tin.</p>
            )}
          </div>

          <button className="order-btn" onClick={() => Order()}>
            Xác Nhận Đặt Hàng
          </button>
        </div>
      </div>
    </section>
  );
}
export default CheckOut;