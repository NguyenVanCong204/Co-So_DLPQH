import { useParams } from 'react-router-dom';
import './ProductDetail.css';
import { addToCart } from '../../features/cart/CartSlider';
import { setCartDetails } from '../../features/cart/Cart';
import { useContext, useEffect, useState } from 'react';
import apiMember from '../../API/apiMember';
import { useDispatch } from 'react-redux';
import MemberCartContext from '../../Context/MemberCartContext';
import { toast } from 'react-toastify';

function formatPrice(price) {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
}

function ProductDetail() {
    const { id } = useParams();
    const [input, SetInput] = useState({});
    const [qualty, SetQualty] = useState(1);
    const [selectedImg, SetselectedImg] = useState();
    const dispatch = useDispatch();
    let totallocal = useContext(MemberCartContext);

    useEffect(() => {
        apiMember.get('/product/' + id).then((res) => {
            SetInput(res.data.data);
            if (res.data?.data?.image) {
                const avatar = JSON.parse(res.data.data.image);
                SetselectedImg(avatar[0]);
            }
        });
    }, [id]);

    function AddProductToCart() {
        const user = localStorage.getItem('user');
        if (user) {
            if (qualty <= 0) {
                toast.warn('Vui lòng chọn số lượng lớn hơn 0');
                return;
            }

            let cart = JSON.parse(localStorage.getItem('cart'));
            if (!cart) {
                cart = {};
            }

            if (cart[id]) {
                cart[id] += qualty;
            } else {
                cart[id] = qualty;
            }

            dispatch(setCartDetails(cart));

            dispatch(addToCart(qualty));

            totallocal.cart = Object.values(cart).reduce((a, b) => a + b, 0);
            totallocal.SetCart(totallocal.cart);

            toast.success(`Đã thêm ${qualty} sản phẩm vào giỏ hàng`);
        } else {
            toast.warn('Vui lòng đăng nhập');
        }
    }

    function AddQualty() {
        SetQualty((qualty) => qualty + 1);
    }
    function DeleteQualty() {
        SetQualty(qualty > 1 ? (qualty) => qualty - 1 : 1);
    }
    function SetselectedImgTop(src) {
        SetselectedImg(src);
    }
    function renderData() {
        const avatar = input?.image ? JSON.parse(input.image) : [];

        const is_on_sale = input.sale > 0;
        const original_price = input.price;
        const sale_percent = input.sale;
        const new_price = original_price * (1 - sale_percent / 100);

        return (
            <div className="product-details-new">
                <div className="col-sm-5 product-image-gallery">
                    <div className="main-image">
                        <img src={`http://localhost:3001/${selectedImg}`} alt="Main product" />
                    </div>
                    <div className="thumbnail-list">
                        {avatar.map((value, index) => {
                            return (
                                <img
                                    key={index}
                                    src={`http://localhost:3001/${value}`}
                                    alt={`Thumbnail ${index + 1}`}
                                    onClick={() => SetselectedImgTop(value)}
                                    className={selectedImg === value ? 'active' : ''}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="col-sm-7 product-info-right">
                    <h2 className="product-title">{input.name}</h2>

                    <p className="product-summary">
                        Thương hiệu: <strong>{input.id_brand?.name || input.company || 'Đang cập nhật'}</strong>
                        <br />
                    </p>

                    <div className="price-box">
                        {is_on_sale ? (
                            <>
                                <span className="price-new">{formatPrice(new_price)}</span>
                                <span className="price-old">{formatPrice(original_price)}</span>
                            </>
                        ) : (
                            <span className="price-new">{formatPrice(original_price)}</span>
                        )}
                    </div>

                    <div className="quantity-container">
                        <div className="quantity-label">Số Lượng:</div>
                        <div className="quantity-control">
                            <button className="quantity-btn" onClick={() => DeleteQualty()}>
                                −
                            </button>
                            <input type="text" className="quantity-input" value={qualty} readOnly />
                            <button className="quantity-btn" onClick={() => AddQualty()}>
                                +
                            </button>
                        </div>
                    </div>

                    <div>
                        <button className="add-to-cart-btn" onClick={() => AddProductToCart()}>
                            <i className="fa fa-shopping-cart"></i>
                            Thêm vào giỏ
                        </button>
                        <button className="buy-by-phone-btn">
                            <i className="fa fa-phone"></i>
                            Gọi đặt mua
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {renderData()}

            <div className="category-tab shop-details-tab">
                <div className="col-sm-12">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#details" data-toggle="tab">
                                Thông số kỹ thuật
                            </a>
                        </li>
                        <li>
                            <a href="#companyprofile" data-toggle="tab">
                                Mô tả sản phẩm
                            </a>
                        </li>
                        <li>
                            <a href="#reviews" data-toggle="tab">
                                Đánh giá
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="tab-content">
                    <div className="tab-pane fade active in" id="details">
                        <h4>Thông số sản phẩm</h4>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th>Tên sản phẩm</th>
                                    <td>{input.name}</td>
                                </tr>
                                <tr>
                                    <th>Thương hiệu</th>
                                    <td>{input.company}</td>
                                </tr>
                                <tr>
                                    <th>Chi tiết</th>
                                    <td style={{ whiteSpace: 'pre-wrap' }}>{input.detail}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="tab-pane fade" id="companyprofile">
                        <h4>Mô tả chi tiết sản phẩm</h4>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{input.detail}</p>
                    </div>

                    <div className="tab-pane fade" id="reviews">
                        <p>
                            <b>Viết đánh giá của bạn</b>
                        </p>
                        <form action="#">
                            <span>
                                <input type="text" placeholder="Tên của bạn" />
                                <input type="email" placeholder="Email" />
                            </span>
                            <textarea name="" defaultValue={''} />
                            <b>Rating: </b>
                            <img src="/images/product-details/rating.png" alt="" />
                            <button type="button" className="btn btn-default pull-right">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductDetail;
