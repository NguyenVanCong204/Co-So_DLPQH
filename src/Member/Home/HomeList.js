import { useContext, useEffect, useState } from 'react';
import './HomeList.css';
import apiMember from '../../API/apiMember';
import { Link, useParams } from 'react-router-dom';
import MemberCartContext from '../../Context/MemberCartContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../features/cart/CartSlider';
import { setCartDetails } from '../../features/cart/Cart';
import { toast } from 'react-toastify';

function formatPrice(price) {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
}

function HomeList() {
    const dispath = useDispatch();
    let totallocal = useContext(MemberCartContext);
    const [input, SetInput] = useState([]);
    const [visibleCount, setVisibleCount] = useState(12);
    const [sliderIndex, setSliderIndex] = useState(0);
    const [sliderProducts, setSliderProducts] = useState([]);

    const { categoryId } = useParams();
    const search = useSelector((state) => state.cart.search);

    function getAllProduct() {
        apiMember
            .get('/product')
            .then((res) => {
                SetInput(Array.isArray(res.data.data) ? res.data.data : []);
            })
            .catch((err) => {
                console.log(err);
                SetInput([]);
            });
    }

    useEffect(() => {
        setVisibleCount(12);

        if (search) {
            apiMember
                .get('/search/product?name=' + search)
                .then((res) => {
                    SetInput(Array.isArray(res.data.data) ? res.data.data : []);
                })
                .catch((err) => {
                    console.error(err);
                    SetInput([]);
                });
        } else if (categoryId) {
            apiMember
                .get(`/product/category/${categoryId}`)
                .then((res) => {
                    SetInput(Array.isArray(res.data.data) ? res.data.data : []);
                })
                .catch((err) => {
                    console.error(err);
                    SetInput([]);
                });
        } else {
            getAllProduct();
        }
    }, [categoryId, search]);

    useEffect(() => {
        apiMember.get('/product').then((res) => {
            if (Array.isArray(res.data.data)) {
                setSliderProducts(res.data.data);
            }
        });

        const interval = setInterval(() => {
            setSliderIndex((prev) => (prev + 1) % 6);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 12);
    };

    function AddCart(id) {
        const user = localStorage.getItem('user');
        if (user) {
            let cart = JSON.parse(localStorage.getItem('cart')) || {};
            if (cart[id]) {
                cart[id] = Number(cart[id]) + 1;
            } else {
                cart[id] = 1;
            }

            dispath(setCartDetails(cart));
            dispath(addToCart(1));
            totallocal.cart = Object.values(cart).reduce((a, b) => a + b, 0);
            totallocal.SetCart(totallocal.cart);

            toast.success('Thêm sản phẩm vào giỏ hàng thành công');
        } else {
            toast.warn('Vui lòng đăng nhập');
        }
    }

    function renderData() {
        if (!Array.isArray(input)) return null;
        const currentItems = input.slice(0, visibleCount);

        return currentItems.map((value, index) => {
            const avatar = JSON.parse(value.image);

            const is_on_sale = value.sale > 0;
            const original_price = value.price;
            const sale_percent = value.sale;
            const new_price = original_price * (1 - sale_percent / 100);

            return (
                <div className="col-sm-4" key={index}>
                    <div className="product-card-new">
                        {is_on_sale && <div className="sale-badge">-{sale_percent}%</div>}

                        <Link to={`/member/home/product/detail/${value._id}`}>
                            <div className="product-image">
                                <img src={`http://localhost:3001/${avatar[0]}`} alt={value.name} />
                            </div>
                        </Link>

                        <div className="product-info">
                            <div>
                                <Link to={`/member/home/product/detail/${value._id}`} className="product-name">
                                    {value.name}
                                </Link>

                                <div className="price-container">
                                    {is_on_sale ? (
                                        <>
                                            <span className="price-new">{formatPrice(new_price)}</span>
                                            <span className="price-old">{formatPrice(original_price)}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="price-new">{formatPrice(original_price)}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button onClick={() => AddCart(value._id)} className="buy-button">
                                <i className="fa fa-shopping-cart" />
                                Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                </div>
            );
        });
    }

    function renderHeroSlider() {
        if (!Array.isArray(sliderProducts)) return null;
        
        // Get top 6 sale products
        const saleProducts = sliderProducts
            .filter(p => p.sale > 0)
            .sort((a, b) => b.sale - a.sale)
            .slice(0, 6);

        if (saleProducts.length === 0) return null;

        return (
            <div className="hero-slider-container">
                {saleProducts.map((value, index) => {
                    const avatar = JSON.parse(value.image);
                    const is_on_sale = value.sale > 0;
                    const original_price = value.price;
                    const sale_percent = value.sale;
                    const new_price = original_price * (1 - sale_percent / 100);

                    // Calculate position relative to sliderIndex
                    let positionClass = 'card-hidden';
                    const diff = (index - sliderIndex + 6) % 6;

                    if (diff === 0) positionClass = 'card-center';
                    else if (diff === 1) positionClass = 'card-right';
                    else if (diff === 2) positionClass = 'card-far-right';
                    else if (diff === 5) positionClass = 'card-left';
                    else if (diff === 4) positionClass = 'card-far-left';

                    return (
                        <div className={`hero-product-card ${positionClass}`} key={index}>
                            <div className="sale-badge">-{sale_percent}%</div>
                            <Link to={`/member/home/product/detail/${value._id}`}>
                                <div className="product-image">
                                    <img src={`http://localhost:3001/${avatar[0]}`} alt={value.name} />
                                </div>
                            </Link>
                            <div className="product-info">
                                <Link to={`/member/home/product/detail/${value._id}`} className="product-name">
                                    {value.name}
                                </Link>
                                <div className="price-container">
                                    <span className="price-new">{formatPrice(new_price)}</span>
                                    <span className="price-old">{formatPrice(original_price)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div>
            <div className="hero-section">
                {renderHeroSlider()}
            </div>

            <div className="features_items" id="products-grid">
                <h2 className="title text-center">Sản Phẩm Nổi Bật</h2>

                {renderData()}
            </div>

                {visibleCount < input.length && (
                    <div style={{ textAlign: 'center', width: '100%', marginTop: '20px', clear: 'both' }}>
                        <button
                            onClick={handleLoadMore}
                            className="btn btn-default"
                            style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                padding: '10px 25px',
                            }}
                        >
                            Hiển thị thêm sản phẩm
                        </button>
                    </div>
                )}
        </div>
    );
}
export default HomeList;
