import { useParams } from "react-router-dom";
import "./ProductDetail.css";
import { useContext, useEffect, useState } from "react";
import api from "../../API/api";
import { addToCart } from "../../features/cart/CartSlider";
import { useDispatch } from "react-redux";
import MemberCartContext from "../../Context/MemberCartContext";
import { toast } from "react-toastify";
function ProductDetail() {
  const { id } = useParams();
  const [input, SetInput] = useState({});
  const [qualty, SetQualty] = useState(1);
  const [selectedImg, SetselectedImg] = useState();
  const dispatch = useDispatch();
  let totallocal = useContext(MemberCartContext);
  useEffect(() => {
    api.get("member/user/product/getproduct/" + id).then((res) => {
      SetInput(res.data);
      if (res.data?.image) {
        const avatar = JSON.parse(res.data.image);
        SetselectedImg(avatar[0]);
      }
    });
  }, []);
  function AddProductToCart(Totalcart) {
    const user = localStorage.getItem("user");
    if (user) {
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (!cart) {
        cart = {};
      }
      if (cart[id]) {
        cart[id] += qualty;
      } else {
        cart[id] = qualty;
      }
      localStorage.setItem("cart", JSON.stringify(cart));

      totallocal.cart = Object.values(cart).reduce((a, b) => a + b, 0);
      //Lấy các giá trị value đưa vào mảng
      //reduce : Tính toán 1 giá trị cuối cùng
      //a : khỏi tạo giá trị ban đầu là 0
      //b : các phần tử trong mảng
      totallocal.SetCart(totallocal.cart);

      toast.success("Thêm sản phẩm vào giỏ hàng thành công");
    } else {
      toast.warn("Vui lòng đăng nhập");
    }
  }
  function AddQualty() {
    SetQualty((qualty) => qualty + 1);
  }
  function DeleteQualty() {
    SetQualty(qualty > 0 ? (qualty) => qualty - 1 : 0);
  }
  function SetselectedImgTop(src) {
    SetselectedImg(src);
  }
  function renderData() {
    const avatar = input?.image ? JSON.parse(input.image) : [];
    return (
      <>
        <div className="detail-left">
          <div className="detail-left-top">
            <img src={`http://localhost:3001/${selectedImg}`}></img>
          </div>
          <div className="detail-left-buttom">
            {avatar.map((value, index) => {
              return (
                <img
                  src={`http://localhost:3001/${value}`}
                  onClick={() => SetselectedImgTop(value)}
                ></img>
              );
            })}
            {/* {<img src={`http://localhost:3001/${avatar[0]}`}></img>}
            {avatar[1] && (
              <img src={`http://localhost:3001/${avatar[1]}`}></img>
            )}
            {avatar[2] && (
              <img src={`http://localhost:3001/${avatar[2]}`}></img>
            )} */}
          </div>
        </div>
        <div className="detail-right">
          <p className="name_product">{input.name}</p>
          <p>{input.price} VND</p>
          <div class="quantity-container">
            <div class="quantity-label">Số Lượng</div>
            <div class="quantity-control">
              <button class="quantity-btn" onClick={() => DeleteQualty()}>
                −
              </button>
              <input
                type="text"
                class="quantity-input"
                value={qualty}
                readOnly
              />
              <button class="quantity-btn" onClick={() => AddQualty()}>
                +
              </button>
            </div>
          </div>
          <button className="buy" onClick={() => AddProductToCart(qualty)}>
            Buy
          </button>
        </div>
      </>
    );
  }
  return (
    <div>
      <div className="product-detail">{renderData()}</div>
      <div className="category-tab shop-details-tab">
        {/*category-tab*/}
        <div className="col-sm-12">
          <ul className="nav nav-tabs">
            <li>
              <a href="#details" data-toggle="tab">
                Details
              </a>
            </li>
            <li>
              <a href="#companyprofile" data-toggle="tab">
                Company Profile
              </a>
            </li>
            <li>
              <a href="#tag" data-toggle="tab">
                Tag
              </a>
            </li>
            <li className="active">
              <a href="#reviews" data-toggle="tab">
                Reviews (5)
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          <div className="tab-pane fade" id="details">
            <div className="col-sm-3">
              <div className="product-image-wrapper">
                <div className="single-products">
                  <div className="productinfo text-center">
                    <img src="/images/home/gallery1.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <button
                      type="button"
                      className="btn btn-default add-to-cart"
                    >
                      <i className="fa fa-shopping-cart" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="product-image-wrapper">
                <div className="single-products">
                  <div className="productinfo text-center">
                    <img src="/images/home/gallery2.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <button
                      type="button"
                      className="btn btn-default add-to-cart"
                    >
                      <i className="fa fa-shopping-cart" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="product-image-wrapper">
                <div className="single-products">
                  <div className="productinfo text-center">
                    <img src="/images/home/gallery3.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <button
                      type="button"
                      className="btn btn-default add-to-cart"
                    >
                      <i className="fa fa-shopping-cart" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="product-image-wrapper">
                <div className="single-products">
                  <div className="productinfo text-center">
                    <img src="/images/home/gallery4.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <button
                      type="button"
                      className="btn btn-default add-to-cart"
                    >
                      <i className="fa fa-shopping-cart" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="companyprofile">
            <div className="col-sm-3">
              <div className="product-image-wrapper">
                <div className="single-products">
                  <div className="productinfo text-center">
                    <img src="/images/home/gallery1.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <button
                      type="button"
                      className="btn btn-default add-to-cart"
                    >
                      <i className="fa fa-shopping-cart" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="product-image-wrapper">
                <div className="single-products">
                  <div className="productinfo text-center">
                    <img src="/images/home/gallery3.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <button
                      type="button"
                      className="btn btn-default add-to-cart"
                    >
                      <i className="fa fa-shopping-cart" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="product-image-wrapper">
                <div className="single-products">
                  <div className="productinfo text-center">
                    <img src="/images/home/gallery2.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <button
                      type="button"
                      className="btn btn-default add-to-cart"
                    >
                      <i className="fa fa-shopping-cart" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="product-image-wrapper">
                <div className="single-products">
                  <div className="productinfo text-center">
                    <img src="/images/home/gallery4.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <button
                      type="button"
                      className="btn btn-default add-to-cart"
                    >
                      <i className="fa fa-shopping-cart" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="tag">
            <div className="col-sm-3">
              <div className="product-image-wrapper">
                <div className="single-products">
                  <div className="productinfo text-center">
                    <img src="/images/home/gallery1.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <button
                      type="button"
                      className="btn btn-default add-to-cart"
                    >
                      <i className="fa fa-shopping-cart" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="product-image-wrapper">
                <div className="single-products">
                  <div className="productinfo text-center">
                    <img src="/images/home/gallery2.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <button
                      type="button"
                      className="btn btn-default add-to-cart"
                    >
                      <i className="fa fa-shopping-cart" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="product-image-wrapper">
                <div className="single-products">
                  <div className="productinfo text-center">
                    <img src="/images/home/gallery3.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <button
                      type="button"
                      className="btn btn-default add-to-cart"
                    >
                      <i className="fa fa-shopping-cart" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="product-image-wrapper">
                <div className="single-products">
                  <div className="productinfo text-center">
                    <img src="/images/home/gallery4.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <button
                      type="button"
                      className="btn btn-default add-to-cart"
                    >
                      <i className="fa fa-shopping-cart" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade active in" id="reviews">
            <div className="col-sm-12">
              <ul>
                <li>
                  <a href>
                    <i className="fa fa-user" />
                    EUGEN
                  </a>
                </li>
                <li>
                  <a href>
                    <i className="fa fa-clock-o" />
                    12:41 PM
                  </a>
                </li>
                <li>
                  <a href>
                    <i className="fa fa-calendar-o" />
                    31 DEC 2014
                  </a>
                </li>
              </ul>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
              <p>
                <b>Write Your Review</b>
              </p>
              <form action="#">
                <span>
                  <input type="text" placeholder="Your Name" />
                  <input type="email" placeholder="Email Address" />
                </span>
                <textarea name defaultValue={""} />
                <b>Rating: </b>{" "}
                <img src="/images/product-details/rating.png" alt="" />
                <button type="button" className="btn btn-default pull-right">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/*/category-tab*/}
      <div className="recommended_items">
        {/*recommended_items*/}
        <h2 className="title text-center">recommended items</h2>
        <div
          id="recommended-item-carousel"
          className="carousel slide"
          data-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="item active">
              <div className="col-sm-4">
                <div className="product-image-wrapper">
                  <div className="single-products">
                    <div className="productinfo text-center">
                      <img src="/images/home/recommend1.jpg" alt="" />
                      <h2>$56</h2>
                      <p>Easy Polo Black Edition</p>
                      <button
                        type="button"
                        className="btn btn-default add-to-cart"
                      >
                        <i className="fa fa-shopping-cart" />
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="product-image-wrapper">
                  <div className="single-products">
                    <div className="productinfo text-center">
                      <img src="/images/home/recommend2.jpg" alt="" />
                      <h2>$56</h2>
                      <p>Easy Polo Black Edition</p>
                      <button
                        type="button"
                        className="btn btn-default add-to-cart"
                      >
                        <i className="fa fa-shopping-cart" />
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="product-image-wrapper">
                  <div className="single-products">
                    <div className="productinfo text-center">
                      <img src="/images/home/recommend3.jpg" alt="" />
                      <h2>$56</h2>
                      <p>Easy Polo Black Edition</p>
                      <button
                        type="button"
                        className="btn btn-default add-to-cart"
                      >
                        <i className="fa fa-shopping-cart" />
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="col-sm-4">
                <div className="product-image-wrapper">
                  <div className="single-products">
                    <div className="productinfo text-center">
                      <img src="/images/home/recommend1.jpg" alt="" />
                      <h2>$56</h2>
                      <p>Easy Polo Black Edition</p>
                      <button
                        type="button"
                        className="btn btn-default add-to-cart"
                      >
                        <i className="fa fa-shopping-cart" />
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="product-image-wrapper">
                  <div className="single-products">
                    <div className="productinfo text-center">
                      <img src="/images/home/recommend2.jpg" alt="" />
                      <h2>$56</h2>
                      <p>Easy Polo Black Edition</p>
                      <button
                        type="button"
                        className="btn btn-default add-to-cart"
                      >
                        <i className="fa fa-shopping-cart" />
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="product-image-wrapper">
                  <div className="single-products">
                    <div className="productinfo text-center">
                      <img src="/images/home/recommend3.jpg" alt="" />
                      <h2>$56</h2>
                      <p>Easy Polo Black Edition</p>
                      <button
                        type="button"
                        className="btn btn-default add-to-cart"
                      >
                        <i className="fa fa-shopping-cart" />
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a
            className="left recommended-item-control"
            href="#recommended-item-carousel"
            data-slide="prev"
          >
            <i className="fa fa-angle-left" />
          </a>
          <a
            className="right recommended-item-control"
            href="#recommended-item-carousel"
            data-slide="next"
          >
            <i className="fa fa-angle-right" />
          </a>
        </div>
      </div>
      {/*/recommended_items*/}
    </div>
  );
}
export default ProductDetail;
