import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer id="footer">

      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-sm-3">
              <div className="single-widget">
                <h2>Địa chỉ</h2>
                <p>
                  <i className="fa fa-map-marker"></i>
                  48 Cao Thắng, phường Thanh Bình, quận Hải Châu, Tp. Đà Nẵng
                </p>
                <p>
                  <i className="fa fa-phone"></i>
                  ĐT: 0123.456.789
                </p>
                <p>
                  <i className="fa fa-envelope"></i>
                  Email: ngovanduong.a2@gmail.com
                </p>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="single-widget">
                <h2>Đại lý - Hỗ trợ</h2>
                <ul className="nav nav-pills nav-stacked">
                  <li>
                    <a href="#">DANH SÁCH CÁC ĐẠI LÝ</a>
                  </li>
                  <li>
                    <a href="#">Hướng dẫn mua hàng</a>
                  </li>
                  <li>
                    <a href="#">Hướng dẫn mua trả góp</a>
                  </li>
                  <li>
                    <a href="#">Hỗ trợ khách hàng</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="single-widget">
                <h2>Chính sách</h2>
                <ul className="nav nav-pills nav-stacked">
                  <li>
                    <a href="#">Quy định, chính sách</a>
                  </li>
                  <li>
                    <a href="#">Chính sách bảo hành - đổi trả</a>
                  </li>
                  <li>
                    <a href="#">Giao hàng và lắp đặt</a>
                  </li>
                  <li>
                    <a href="#">Chính sách bảo mật TT cá nhân</a>
                  </li>
                  <li>
                    <a href="#">Tin tức khuyến mãi</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="single-widget">
                <h2>Đăng ký nhận ưu đãi</h2>
                <p>
                  Hãy đăng ký email của bạn để nhận bản tin khuyến mãi nhanh
                  nhất.
                </p>
                <form action="#" className="searchform">
                  <input type="email" placeholder="Nhập email của bạn" />
                  <button type="submit">ĐĂNG KÝ</button>
                </form>
                <div className="social-icons">
                  <ul className="nav">
                    <li>
                      <a href="#">
                        <i className="fab fa-google-plus-g"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-youtube"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;