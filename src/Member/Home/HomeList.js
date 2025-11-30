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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

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
        setCurrentPage(1);

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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        if (!Array.isArray(input)) return null;
        const totalPages = Math.ceil(input.length / itemsPerPage);
        if (totalPages <= 1) return null;
        const pageButtons = [];

        pageButtons.push(
            <li key="prev" className={currentPage === 1 ? 'disabled' : ''}>
                {currentPage === 1 ? (
                    <a>&laquo;</a>
                ) : (
                    <a onClick={() => handlePageChange(currentPage - 1)} href="#">
                        &laquo;
                    </a>
                )}
            </li>,
        );
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, currentPage + 1);

        if (currentPage === 1) {
            endPage = Math.min(totalPages, 3);
        }
        if (currentPage === totalPages) {
            startPage = Math.max(1, totalPages - 2);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <li key={i} className={currentPage === i ? 'active' : ''}>
                    <a onClick={() => handlePageChange(i)} href="#">
                        {i}
                    </a>
                </li>,
            );
        }
        pageButtons.push(
            <li key="next" className={currentPage === totalPages ? 'disabled' : ''}>
                {currentPage === totalPages ? (
                    <a>&raquo;</a>
                ) : (
                    <a onClick={() => handlePageChange(currentPage + 1)} href="#">
                        &raquo;
                    </a>
                )}
            </li>,
        );

        return <ul className="pagination">{pageButtons}</ul>;
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
        const lastIndex = currentPage * itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        const currentItems = input.slice(firstIndex, lastIndex);

        return currentItems.map((value, index) => {
            const avatar = JSON.parse(value.image);

            const is_on_sale = value.status == 0 && value.sale > 0;
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

    return (
        <div>
            <div className="hero-section">
                <div className="hero-content">
                    {/* <h1>Tinh Hoa Bếp Việt</h1>
                    <p>Mang sự ấm cúng và tiện nghi đến ngôi nhà của bạn với bộ sưu tập đồ gia dụng cao cấp.</p> */}
                    <button
                        className="hero-btn"
                        onClick={() => {
                            const element = document.getElementById('products-grid');
                            element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Khám Phá Ngay
                    </button>
                </div>
            </div>

            <div className="features_items" id="products-grid">
                <h2 className="title text-center">Sản Phẩm Nổi Bật</h2>

                {renderData()}
            </div>

            <div className="col-sm-12" style={{ textAlign: 'center' }}>
                {renderPagination()}
            </div>
        </div>
    );
}
export default HomeList;
