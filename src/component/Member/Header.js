import { useContext, useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";
import MemberCartContext from "../../Context/MemberCartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Search } from "../../features/cart/CartSlider";
function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const dispath = useDispatch();
  const total = useContext(MemberCartContext);
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
    total.SetCart(0);
    toast.success("Logout thành công");
  }
  function Login() {
    navigate("/");
  }
  function Account() {
    navigate("/member/account/update");
  }
  return (
    <div>
      <header id="header">
        {/*header*/}
        <div className="header_top">
          {/*header_top*/}
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <div className="contactinfo">
                  <ul className="nav nav-pills">
                    <li>
                      <a href>
                        <i className="fa fa-phone" /> +2 95 01 88 821
                      </a>
                    </li>
                    <li>
                      <a href>
                        <i className="fa fa-envelope" /> info@domain.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="social-icons pull-right">
                  <ul className="nav navbar-nav">
                    <li>
                      <a href>
                        <i className="fa fa-facebook" />
                      </a>
                    </li>
                    <li>
                      <a href>
                        <i className="fa fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href>
                        <i className="fa fa-linkedin" />
                      </a>
                    </li>
                    <li>
                      <a href>
                        <i className="fa fa-dribbble" />
                      </a>
                    </li>
                    <li>
                      <a href>
                        <i className="fa fa-google-plus" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*/header_top*/}
        <div className="header-middle">
          {/*header-middle*/}
          <div className="container">
            <div className="row">
              <div className="col-md-4 clearfix">
                <div className="logo pull-left">
                  <a href="#" onClick={HandleHome}>
                    <img src="/images/home/logo.png" alt="" />
                  </a>
                </div>
                <div className="btn-group pull-right clearfix">
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-default dropdown-toggle usa"
                      data-toggle="dropdown"
                    >
                      USA
                      <span className="caret" />
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a>Canada</a>
                      </li>
                      <li>
                        <a>UK</a>
                      </li>
                    </ul>
                  </div>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-default dropdown-toggle usa"
                      data-toggle="dropdown"
                    >
                      DOLLAR
                      <span className="caret" />
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a>Canadian Dollar</a>
                      </li>
                      <li>
                        <a>Pound</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-8 clearfix">
                <div className="shop-menu clearfix pull-right">
                  <ul className="nav navbar-nav">
                    {user && (
                      <li>
                        <a href="#" onClick={() => Account()}>
                          <i className="fa fa-user" /> {user.name}
                        </a>
                      </li>
                    )}
                    <li>
                      <a>
                        <i className="fa fa-star" /> Wishlist
                      </a>
                    </li>
                    <li>
                      <Link to="/member/product/checkout">
                        <a href="checkout.html">
                          <i className="fa fa-crosshairs" /> Checkout
                        </a>
                      </Link>
                    </li>
                    <li>
                      <a href="" onClick={() => HandleCart()}>
                        <i className="fa fa-shopping-cart" /> {total.cart} Cart
                      </a>
                    </li>
                    {user ? (
                      <li>
                        <a href="#" onClick={() => Logout()}>
                          <i className="fa fa-lock" /> Logout
                        </a>
                      </li>
                    ) : (
                      <li>
                        <a href="#" onClick={() => Login()}>
                          <i className="fa fa-lock" /> Login
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*/header-middle*/}
        <div className="header-bottom">
          {/*header-bottom*/}
          <div className="container">
            <div className="row">
              <div className="col-sm-9">
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
                <div className="mainmenu pull-left">
                  <ul className="nav navbar-nav collapse navbar-collapse">
                    <li>
                      <Link to="/member/home">
                        <a href="index.html">Home</a>
                      </Link>
                    </li>
                    <li className="dropdown">
                      <a href="#">
                        Shop
                        <i className="fa fa-angle-down" />
                      </a>
                      <ul role="menu" className="sub-menu">
                        <li>
                          <a href="shop.html">Products</a>
                        </li>
                        <li>
                          <a href="product-details.html">Product Details</a>
                        </li>
                        <li>
                          <a href="checkout.html">Checkout</a>
                        </li>
                        <li>
                          <a href="cart.html">Cart</a>
                        </li>
                        <li>
                          <a href="login.html">Login</a>
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown">
                      <Link to="/member/blog/list">
                        <a href="#" className="active">
                          Blog
                          <i className="fa fa-angle-down" />
                        </a>
                      </Link>
                      <ul role="menu" className="sub-menu">
                        <li>
                          <a href="blog.html" className="active">
                            Blog List
                          </a>
                        </li>
                        <li>
                          <a href="blog-single.html">Blog Single</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="404.html">404</a>
                    </li>
                    <li>
                      <a href="contact-us.html">Contact</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="search_box pull-right">
                  <input
                    type="text"
                    placeholder="Search"
                    value={keyword}
                    onChange={(e) => SearchProduct(e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*/header-bottom*/}
      </header>
      {/*/header*/}
    </div>
  );
}
export default Header;
