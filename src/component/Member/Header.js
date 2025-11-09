import { useContext, useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../../features/cart/CartSlider";
import "./Header.css";
import apiAdmin from "../../API/apiAdmin";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const dispath = useDispatch();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiAdmin
      .get("/category")
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải category cho header:", err);
      });
  }, []);

  const totalCart = useSelector((state) => state.cart.value);
  const [keyword, setKeyword] = useState("");

  function SearchProduct(e) {
    let value = e.target.value;
    setKeyword(value);
    dispath(Search(value));
  }
  function HandleCart() {
    navigate("/member/home/cart");
  }
  function HandleHome() {
    navigate("/member/home");
  }
  function Logout() {
    localStorage.clear();
    navigate("/");
    dispath(Search(""));
    toast.success("Logout thành công");
  }
  function Login() {
    navigate("/");
  }
  function Account() {
    navigate("/member/account/update");
  }

  return (
    <header id="header">
      <div className="header-main">
        <div className="container">
          <div className="row" style={{ alignItems: "center" }}>
            
            <div className="col-md-3">
              <div className="logo-container">
                <a href="#" onClick={HandleHome}>
                  <img src="/images/home/logo.png" alt="Logo" />
                </a>
              </div>
            </div>

            <div className="col-md-9">
              <div className="header-right-wrapper">
                
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Bạn cần tìm gì hôm nay..."
                    value={keyword}
                    onChange={(e) => SearchProduct(e)}
                  />
                  <button type="button">
                    <i className="fa fa-search"></i>
                  </button>
                </div>

                <div className="header-info">
                  <span>Tư vấn bán hàng:</span>
                  <span className="hotline">0123.456.789</span>
                </div>

                <div className="header-info-icons">
                  <a href="#" onClick={() => HandleCart()}>
                    <i className="fa fa-shopping-cart"></i>
                    <span>Giỏ hàng ({totalCart})</span>
                  </a>

                  {user ? (
                    <>
                      <a href="#" onClick={() => Account()}>
                        <i className="fa fa-user"></i>
                        <span>{user.name}</span>
                      </a>
                      <a href="#" onClick={() => Logout()}>
                        <i className="fa fa-lock"></i>
                        <span>Đăng xuất</span>
                      </a>
                    </>
                  ) : (
                    <a href="#" onClick={() => Login()}>
                      <i className="fa fa-lock"></i>
                      <span>Đăng nhập</span>
                    </a>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="header-nav">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="navbar-header">
                <button
                  type="button"
                  className="navbar-toggle"
                  data-toggle="collapse"
                  data-target=".navbar-collapse"
                >
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                </button>
              </div>
              <div className="mainmenu collapse navbar-collapse">
                <ul className="nav navbar-nav">
                  <li>
                    <Link to="/member/home">Trang chủ</Link>
                  </li>
                  {categories.slice(0, 5).map((category) => (
                    <li key={category._id}>
                      <Link to={`/member/category/${category._id}`}>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/member/blog/list">Tin tức</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;