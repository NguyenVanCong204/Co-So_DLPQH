import { useContext, useEffect, useState } from 'react';
import apiMember from '../../API/apiMember';
import { resetCartRedux } from '../../features/cart/Cart';
import { resetCartSlider } from '../../features/cart/CartSlider';
import { useSelector, useDispatch } from 'react-redux';
import refershToken from '../../RefershToken/RefershToken';
import MemberCartContext from '../../Context/MemberCartContext';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import './CheckOut.css';
import Breadcrumb from '../../component/Member/Breadcrumb';

const VND_TO_USD_RATE = 25000;

function formatPrice(price) {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
}

function CheckOut() {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };

    const navigate = useNavigate();
    const totallocal = useContext(MemberCartContext);
    const cart = useSelector((state) => state.cartredux);
    const dispatch = useDispatch();

    const [AllQualtyCart, SetAllQualtyCart] = useState(0);
    const [inputProducts, SetInputProducts] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isLoading, setIsLoading] = useState(false);

    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            console.error('Lỗi đọc user từ localStorage');
            return null;
        }
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await apiMember.post('/cart', cart);
                const products = Array.isArray(res.data.data) ? res.data.data : [];
                SetInputProducts(products);

                let total = 0;
                products.forEach((value) => {
                    const is_on_sale = value.sale > 0;
                    const price = is_on_sale ? value.price * (1 - value.sale / 100) : value.price;
                    total += price * value.qty;
                });
                SetAllQualtyCart(total);
            } catch (err) {
                toast.error('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
                console.error(err);
            } finally {
                setIsDataLoaded(true);
            }
        };

        fetchCart();

        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    }, [cart, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const RenderOrderData = () => {
        if (inputProducts.length === 0)
            return <div style={{ padding: '20px', textAlign: 'center' }}>Giỏ hàng trống</div>;

        return inputProducts.map((value, index) => {
            let avatar = [];
            try {
                avatar = JSON.parse(value.image) || [];
            } catch {
                avatar = [];
            }
            const is_on_sale = value.sale > 0;
            const new_price = is_on_sale ? value.price * (1 - value.sale / 100) : value.price;

            return (
                <div className="order-product-item" key={index}>
                    <img src={`http://localhost:3001/${avatar[0] || 'no-image.png'}`} alt={value.name} />
                    <div className="order-product-info">
                        <span className="name">
                            {value.name} (x{value.qty})
                        </span>
                        <span className="price">{formatPrice(new_price * value.qty)}</span>
                    </div>
                </div>
            );
        });
    };

    const processOrder = async (paymentSource = 'COD') => {
        if (!user) {
            toast.warn('Vui lòng đăng nhập');
            navigate('/');
            return Promise.reject('Chưa đăng nhập');
        }

        if (!user._id && !user.id) {
            console.error('User object missing ID:', user);
            toast.error('Lỗi thông tin người dùng. Vui lòng đăng nhập lại.');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/member/login');
            return Promise.reject('Missing user ID');
        }

        if (Object.keys(cart).length === 0) {
            toast.warn('Vui lòng thêm sản phẩm vào giỏ hàng');
            return Promise.reject('Giỏ hàng rỗng');
        }
        if (!formData.name || !formData.address || !formData.phone || !formData.email) {
            toast.error('Vui lòng điền đầy đủ thông tin mua hàng.');
            return Promise.reject('Thiếu thông tin');
        }

        const orderData = {
            user: { ...user, ...formData, note },
            cart,
            paymentMethod: paymentMethod,
        };

        setIsLoading(true);

        try {
            const res = await apiMember.post('/order', orderData, config);
            toast.success(`Đặt hàng (${paymentSource}) thành công!`);
            localStorage.removeItem('cart');
            localStorage.removeItem('total');
            totallocal.SetCart(0);
            dispatch(resetCartRedux());
            dispatch(resetCartSlider());
            navigate('/member/home');
            return res;
        } catch (error) {
            console.error('Full error object:', error);

            if (error.response?.status === 401) {
                try {
                    const newtoken = await refershToken();
                    if (!newtoken) {
                        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                        return Promise.reject(error);
                    }
                    const newConfig = {
                        headers: {
                            Authorization: `Bearer ${newtoken}`,
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    };
                    const res2 = await apiMember.post('/order', orderData, newConfig);
                    toast.success(`Đặt hàng (${paymentSource}) thành công! (sau khi refresh)`);
                    localStorage.removeItem('cart');
                    localStorage.removeItem('total');
                    totallocal.SetCart(0);
                    dispatch(resetCartRedux());
                    dispatch(resetCartSlider());
                    navigate('/member/home');
                    return res2;
                } catch (refreshError) {
                    toast.error('Lỗi khi làm mới token. Vui lòng đăng nhập lại.');
                    return Promise.reject(refreshError);
                }
            } else {
                const errorData = error.response?.data;
                let msg = 'Lỗi không xác định';

                if (errorData) {
                    console.log('Server error data:', errorData);

                    if (errorData.errors) {
                        if (typeof errorData.errors === 'object') {
                            const errorValues = Object.values(errorData.errors);
                            if (errorValues.length > 0) {
                                const firstVal = errorValues[0];
                                msg = Array.isArray(firstVal) ? firstVal[0] : firstVal;
                            }
                        } else {
                            msg = errorData.errors;
                        }
                    } else if (errorData.error) {
                        if (typeof errorData.error === 'object') {
                            const keys = Object.keys(errorData.error);
                            if (keys.length > 0) {
                                msg = errorData.error[keys[0]];
                            } else {
                                msg = JSON.stringify(errorData.error);
                            }
                        } else {
                            msg = errorData.error;
                        }
                    } else if (errorData.message) {
                        msg = errorData.message;
                    }
                } else {
                    msg = error.message || 'Không thể kết nối đến server';
                }

                toast.error('Lỗi khi đặt hàng: ' + msg);
                return Promise.reject(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOrderCOD = () => {
        processOrder('COD');
    };

    const createOrder = (data, actions) => {
        if (!formData.name || !formData.address || !formData.phone || !formData.email) {
            toast.error('Vui lòng điền đầy đủ thông tin mua hàng trước.');
            return Promise.reject('Thiếu thông tin');
        }
        const ecoTax = inputProducts.length > 0 ? 2 : 0;
        const finalTotal = AllQualtyCart + ecoTax;
        const totalUSD = (finalTotal / VND_TO_USD_RATE).toFixed(2);

        if (parseFloat(totalUSD) <= 0) {
            toast.error('Không thể thanh toán PayPal cho đơn hàng 0đ.');
            return Promise.reject('Đơn hàng 0đ');
        }

        return actions.order.create({
            purchase_units: [
                {
                    description: 'Thanh toán đơn hàng tại HKDN-3AE',
                    amount: {
                        value: totalUSD,
                        currency_code: 'USD',
                    },
                },
            ],
        });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async (details) => {
            toast.success(`Thanh toán thành công bởi ${details.payer.name.given_name}`);
            await processOrder('PayPal');
        });
    };

    const onError = (err) => {
        toast.error('Thanh toán PayPal xảy ra lỗi. Vui lòng thử lại.');
        console.error('PayPal Error:', err);
    };

    return (
        <PayPalScriptProvider
            options={{
                'client-id': 'AYQS_sP-Z621V45RGGTyYaIcwGnOhpnV0-WrPG7yNsnUGMPiRG_mkaYm_wW_sNmjhM5eDA-q1_88u_pq',
                currency: 'USD',
                components: 'buttons',
            }}
        >
            <section className="checkout-page">
                <div className="container" style={{marginBottom: '20px'}}>
                    <Breadcrumb items={[{ label: 'Thanh toán' }]} />
                </div>
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                    </div>
                )}

                <div className="checkout-title-bar">THANH TOÁN</div>

                <div className="row" style={{ background: '#fff', padding: '15px', margin: '0' }}>
                    <div className="col-md-5">
                        <div className="checkout-form">
                            <h3>THÔNG TIN MUA HÀNG</h3>
                            {['name', 'address', 'phone', 'email'].map((field, idx) => (
                                <div className="form-group" key={idx}>
                                    <label htmlFor={field}>
                                        {field === 'name'
                                            ? 'Họ và Tên'
                                            : field === 'address'
                                            ? 'Địa chỉ'
                                            : field === 'phone'
                                            ? 'Số điện thoại'
                                            : 'Email'}{' '}
                                        <span>*</span>
                                    </label>
                                    <input
                                        type={field === 'email' ? 'email' : 'text'}
                                        className="form-control"
                                        id={field}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                        placeholder={`Nhập ${field}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="checkout-form">
                            <h3>THÔNG TIN THÊM</h3>
                            <div className="form-group">
                                <label htmlFor="note">Ghi chú đơn hàng (tùy chọn)</label>
                                <textarea
                                    className="form-control"
                                    id="note"
                                    name="note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Ghi chú về đơn hàng..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="payment-box">
                            <h3>HÌNH THỨC THANH TOÁN</h3>
                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="cod"
                                    name="payment_method"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="cod">Trả tiền mặt khi nhận hàng</label>
                            </div>
                            <div className="radio-option" style={{ marginTop: '10px' }}>
                                <input
                                    type="radio"
                                    id="paypal"
                                    name="payment_method"
                                    value="paypal"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="paypal">Thanh toán bằng PayPal</label>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        {isDataLoaded ? (
                            <div className="order-summary-box">
                                <h3>ĐƠN HÀNG ({inputProducts.length} sản phẩm)</h3>
                                <div className="order-product-list">{RenderOrderData()}</div>
                                <div className="order-total-summary">
                                    <ul>
                                        <li>
                                            Tạm tính <span>{formatPrice(AllQualtyCart)}</span>
                                        </li>
                                        <li>
                                            Eco Tax <span>{formatPrice(inputProducts.length > 0 ? 2 : 0)}</span>
                                        </li>
                                        <li className="total">
                                            Tổng cộng <span>{formatPrice(AllQualtyCart + (inputProducts.length > 0 ? 2 : 0))}</span>
                                        </li>
                                    </ul>
                                </div>

                                {paymentMethod === 'cod' ? (
                                    <button
                                        className="order-submit-btn"
                                        onClick={handleOrderCOD}
                                        disabled={AllQualtyCart <= 0}
                                    >
                                        Đặt Hàng (COD)
                                    </button>
                                ) : AllQualtyCart > 0 ? (
                                    <div style={{ padding: '10px' }}>
                                        <PayPalButtons
                                            key={AllQualtyCart}
                                            style={{ layout: 'vertical' }}
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                            onError={onError}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ padding: '10px', textAlign: 'center', color: '#999' }}>
                                        Không thể thanh toán PayPal cho đơn hàng 0đ.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="order-summary-box">
                                <h3>ĐƠN HÀNG</h3>
                                <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải giỏ hàng...</div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PayPalScriptProvider>
    );
}

export default CheckOut;
