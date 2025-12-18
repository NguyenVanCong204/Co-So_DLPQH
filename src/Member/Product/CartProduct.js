import { useContext, useEffect, useState } from 'react';
import apiMember from '../../API/apiMember';
import './CartProduct.css';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, addQuantityCart, removeQuantityCart } from '../../features/cart/Cart';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Breadcrumb from '../../component/Member/Breadcrumb';

function formatPrice(price) {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
}

function CartProduct() {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const [AllQuantityCart, SetAllQuantityCart] = useState(0);
    const [input, SetInput] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        let tongQuantityCart = 0;
        apiMember.post('/cart', cartItems).then((res) => {
            const products = Array.isArray(res.data.data) ? res.data.data : [];
            SetInput(products);
            products.map((value, index) => {
                const is_on_sale = value.sale > 0;
                const original_price = value.price;
                const new_price = is_on_sale ? original_price * (1 - value.sale / 100) : original_price;

                tongQuantityCart += new_price * value.qty;
            });
            SetAllQuantityCart(tongQuantityCart);
        });
    }, [cartItems]);

    function removeQuantityCartProduct(id, qty) {
        if (qty > 1) {
            dispatch(removeQuantityCart(id));
        } else {
            toast.info('Số lượng sản phẩm tối thiểu là 1');
        }
    }

    function addQuantityCartProduct(id, qty) {
        dispatch(addQuantityCart(id));
    }

    function removeFromCartProduct(id, qty) {
        dispatch(removeFromCart(id));
        toast.success('Xóa sản phẩm khỏi giỏ hàng thành công');
    }

    function handleCheckout(e) {
        e.preventDefault();
        if (input.length === 0) {
            toast.warn('Giỏ hàng của bạn đang trống!');
        } else {
            navigate('/member/product/checkout');
        }
    }

    function renderData() {
        if (input.length === 0) {
            return (
                <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                        Giỏ hàng của bạn đang trống.
                    </td>
                </tr>
            );
        }

        return input.map((value, index) => {
            const avatar = JSON.parse(value.image);
            const is_on_sale = value.sale > 0;
            const original_price = value.price;
            const new_price = is_on_sale ? original_price * (1 - value.sale / 100) : original_price;
            return (
                <tr key={index}>
                    <td className="cart_product" data-label="Sản Phẩm">
                        <div className="product-info">
                            <img src={`http://localhost:3001/${avatar[0]}`} alt={value.name} />
                            <div>
                                <Link to={`/member/home/product/detail/${value._id}`}>{value.name}</Link>
                            </div>
                        </div>
                    </td>
                    <td className="cart_price" data-label="Giá Đơn Vị">
                        {is_on_sale ? (
                            <>
                                <p style={{ color: '#d9534f' }}>{formatPrice(new_price)}</p>
                                <p style={{ textDecoration: 'line-through', fontSize: '12px', color: '#999' }}>
                                    {formatPrice(original_price)}
                                </p>
                            </>
                        ) : (
                            <p>{formatPrice(original_price)}</p>
                        )}
                    </td>
                    <td className="cart_quantity" data-label="Số Lượng">
                        <div className="quantity-control">
                            <button
                                className="quantity-btn"
                                onClick={() => removeQuantityCartProduct(value._id, value.qty)}
                            >
                                −
                            </button>
                            <input type="text" className="quantity-input" value={value.qty} readOnly />
                            <button
                                className="quantity-btn"
                                onClick={() => addQuantityCartProduct(value._id, value.qty)}
                            >
                                +
                            </button>
                        </div>
                    </td>
                    <td className="cart_total" data-label="Tổng Tiền">
                        <p className="cart_price">{formatPrice(new_price * value.qty)}</p>
                    </td>
                    <td className="cart_delete" data-label="Xóa">
                        <a onClick={() => removeFromCartProduct(value._id, value.qty)}>
                            <i className="fa fa-times" />
                        </a>
                    </td>
                </tr>
            );
        });
    }

    const isCartEmpty = input.length === 0;
    const ecoTax = isCartEmpty ? 0 : 2;
    const finalTotal = isCartEmpty ? 0 : AllQuantityCart + ecoTax;

    return (
        <section id="cart_items_new">
            <Breadcrumb items={[{ label: 'Giỏ hàng' }]} />
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
                                Tạm tính <span>{formatPrice(AllQuantityCart)}</span>
                            </li>
                            <li>
                                Eco Tax <span>{formatPrice(ecoTax)}</span>
                            </li>
                            <li>
                                Phí Vận Chuyển <span>Free</span>
                            </li>
                            <li className="total">
                                Tổng <span>{formatPrice(finalTotal)}</span>
                            </li>
                        </ul>
                        <a href="#" className="checkout-btn" onClick={handleCheckout}>
                            Tiến hành thanh toán
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default CartProduct;
