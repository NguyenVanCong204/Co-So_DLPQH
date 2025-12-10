import { useParams } from 'react-router-dom';
import './ProductDetail.css';
import { addToCart } from '../../features/cart/CartSlider';
import { setCartDetails } from '../../features/cart/Cart';
import { useContext, useEffect, useState } from 'react';
import apiMember from '../../API/apiMember';
import { useDispatch } from 'react-redux';
import MemberCartContext from '../../Context/MemberCartContext';
import { toast } from 'react-toastify';
import Breadcrumb from '../../component/Member/Breadcrumb';

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

    // Review states
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [filterType, setFilterType] = useState('all'); // all, 5, 4, 3, 2, 1, image
    
    const [commentText, setCommentText] = useState("");
    const [currentRating, setCurrentRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false); // Toggle form

    useEffect(() => {
        apiMember.get('/product/' + id).then((res) => {
            SetInput(res.data.data);
            if (res.data?.data?.image) {
                const avatar = JSON.parse(res.data.data.image);
                SetselectedImg(avatar[0]);
            }
        });

        // Fetch Reviews
        apiMember.get('/product/' + id + '/reviews')
            .then(res => {
                const data = Array.isArray(res.data.data) ? res.data.data : [];
                setReviews(data);
                setFilteredReviews(data);
            })
            .catch(err => console.log(err));

    }, [id]);

    useEffect(() => {
        if (filterType === 'all') {
            setFilteredReviews(reviews);
        } else if (filterType === 'image') {
            // Placeholder: currently reviews don't have images in model, but if they did:
            // setFilteredReviews(reviews.filter(r => r.images && r.images.length > 0)); 
            setFilteredReviews(reviews); 
        } else {
            const stars = parseInt(filterType);
            setFilteredReviews(reviews.filter(r => r.rating === stars));
        }
    }, [filterType, reviews]);

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

    const handleReviewSubmit = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warn('Vui lòng đăng nhập để viết đánh giá');
            return;
        }
        if (currentRating === 0) {
            toast.warn('Vui lòng chọn số sao đánh giá');
            return;
        }
        if (!commentText.trim()) {
            toast.warn('Vui lòng nhập nội dung đánh giá');
            return;
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        apiMember.post(`/product/${id}/review`, { rating: currentRating, comment: commentText }, config)
            .then(res => {
                toast.success('Đánh giá thành công!');
                setCommentText('');
                setCurrentRating(0);
                setCommentText('');
                setCurrentRating(0);
                setShowReviewForm(false);
                // Refresh reviews
                apiMember.get('/product/' + id + '/reviews').then(r => {
                    const data = r.data.data || [];
                    setReviews(data);
                });
            })
            .catch(err => {
                console.error(err);
                if (err.response?.status === 400 && err.response.data.error.includes("đã đánh giá")) {
                    toast.error('Bạn đã đánh giá sản phẩm này rồi!');
                } else {
                    toast.error(err.response?.data?.error || 'Lỗi khi gửi đánh giá');
                }
            });
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => {
            const fullStar = index + 1 <= rating;
            const halfStar = index + 0.5 === rating; // Exact half logic if data supports it
            // Simple logic: if rating >= index + 1 -> full. 
            // if rating >= index + 0.5 && rating < index + 1 -> half.
            
            let iconClass = "fa fa-star-o";
            let color = "#ccc";
            
            if (rating >= index + 1) {
                iconClass = "fa fa-star";
                color = "#FE980F";
            } else if (rating >= index + 0.5) {
                iconClass = "fa fa-star-half-o";
                color = "#FE980F";
            }

            return (
                <i 
                    key={index} 
                    className={iconClass} 
                    style={{ color: color, marginRight: '2px' }}
                ></i>
            );
        });
    }

    // Stats calculation
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) 
        : 0;
    
    // Count per star
    const starCounts = { 5:0, 4:0, 3:0, 2:0, 1:0 };
    reviews.forEach(r => {
        if(starCounts[r.rating] !== undefined) starCounts[r.rating]++;
    });
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
            {input.name && (
                <Breadcrumb 
                    items={[
                        { label: 'Sản Phẩm', path: '/member/home' },
                        ...(input.id_category ? [{ label: input.id_category.category, path: `/member/category/${input.id_category._id}` }] : []), // Assuming populate returns .category or .name
                        { label: input.name }
                    ]} 
                />
            )}
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
                                    <td>{input.id_brand?.name || input.brand || input.company}</td>
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
                        
                        {/* Rating Dashboard */}
                        <div className="rating-dashboard" style={{marginBottom: '30px', border: '1px solid #eee', padding: '20px', borderRadius: '8px', display: 'flex', flexWrap: 'wrap'}}>
                             <div className="rating-summary col-sm-5" style={{borderRight: '1px solid #eee', textAlign: 'center', paddingRight: '20px'}}>
                                 <div className="avg-score" style={{fontSize: '48px', fontWeight: 'bold', color: '#FE980F', lineHeight: '1'}}>
                                     {avgRating}<span style={{fontSize: '24px', color: '#999'}}>/5</span>
                                 </div>
                                 <div className="avg-stars" style={{fontSize: '18px', margin: '10px 0'}}>
                                     {renderStars(parseFloat(avgRating))}
                                 </div>
                                 <div className="total-rating-count" style={{color: '#666', marginBottom: '15px'}}>
                                     {totalReviews} lượt đánh giá
                                 </div>
                                 <button 
                                     className="btn btn-primary" 
                                     style={{background: '#d70018', border: 'none', padding: '10px 30px', fontWeight: 'bold'}}
                                     onClick={() => setShowReviewForm(!showReviewForm)}
                                 >
                                     Viết đánh giá
                                 </button>
                             </div>
                             
                             <div className="rating-bars col-sm-7" style={{paddingLeft: '30px'}}>
                                 {[5,4,3,2,1].map(star => {
                                     const count = starCounts[star];
                                     const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                     return (
                                         <div key={star} className="rating-bar-row" style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                                             <span style={{width: '20px', fontWeight: 'bold'}}>{star} <i className="fa fa-star" style={{fontSize: '10px', color: '#ccc'}}></i></span>
                                             <div className="progress" style={{flex: 1, height: '8px', margin: '0 10px', background: '#eee', borderRadius: '4px'}}>
                                                 <div 
                                                     className="progress-bar" 
                                                     style={{width: `${percent}%`, background: '#d70018', height: '100%', borderRadius: '4px'}}
                                                 ></div>
                                             </div>
                                             <span style={{width: '70px', fontSize: '12px', color: '#666', textAlign: 'right'}}>{count} đánh giá</span>
                                         </div>
                                     )
                                 })}
                             </div>
                        </div>

                        {showReviewForm && (
                            <div className="replay-box" style={{marginTop: '20px', border: '1px solid #eee', padding: '20px', borderRadius: '8px', background: '#f9f9f9'}}>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h2 style={{marginTop: 0}}>Viết đánh giá của bạn</h2>
                                        <div className="text-area">
                                            <div className="blank-arrow">
                                                <label>Đánh giá:</label>
                                            </div>
                                            
                                            <div style={{fontSize: '24px', marginBottom: '15px', cursor: 'pointer'}}>
                                                {[...Array(5)].map((_, index) => {
                                                    const starValue = index + 1;
                                                    return (
                                                        <i 
                                                            key={index}
                                                            className="fa fa-star"
                                                            style={{ color: starValue <= (hoverRating || currentRating) ? '#FE980F' : '#ccc', marginRight: '5px' }}
                                                            onClick={() => setCurrentRating(starValue)}
                                                            onMouseEnter={() => setHoverRating(starValue)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                        ></i>
                                                    );
                                                })}
                                                <span style={{fontSize: '14px', color: '#666', marginLeft: '10px'}}>{currentRating ? '' : '(Chọn số sao)'}</span>
                                            </div>

                                            <textarea 
                                                name="message" 
                                                rows="4" 
                                                placeholder="Mời bạn chia sẻ cảm nhận về sản phẩm..."
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                style={{marginBottom: '15px', width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd'}}
                                            ></textarea>
                                            
                                            <button 
                                                type="button" 
                                                className="btn btn-primary" 
                                                style={{background: '#d70018', border: 'none', padding: '10px 30px'}}
                                                onClick={handleReviewSubmit}
                                            >
                                                Gửi đánh giá
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="review-filters" style={{display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0', flexWrap: 'wrap'}}>
                            <span style={{fontWeight: 'bold', fontSize: '16px'}}>Lọc đánh giá theo:</span>
                            {['all', '5', '4', '3', '2', '1'].map(type => {
                                let label = '';
                                if (type === 'all') label = 'Tất cả';
                                else label = `${type} sao`;
                                
                                const isActive = filterType === type;
                                return (
                                    <button 
                                        key={type}
                                        onClick={() => setFilterType(type)}
                                        style={{
                                            border: isActive ? '1px solid #d70018' : '1px solid #ddd',
                                            background: isActive ? '#fff3f3' : '#fff',
                                            color: isActive ? '#d70018' : '#333',
                                            padding: '5px 15px',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            outline: 'none'
                                        }}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>
                        
                        <div className="response-area">
                            <ul className="media-list">
                                {filteredReviews.length > 0 ? filteredReviews.map((review, index) => {
                                    const date = new Date(review.createdAt).toLocaleDateString();
                                    return (
                                        <li className="media" key={index} style={{marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px'}}>
                                            <a className="pull-left" href="#">
                                                <div 
                                                    style={{
                                                        width: '50px', 
                                                        height: '50px', 
                                                        borderRadius: '50%', 
                                                        background: '#ccc', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        color: '#fff',
                                                        fontWeight: 'bold',
                                                        fontSize: '20px',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {review.avatar_user ? (
                                                        <img src={`http://localhost:3001/${review.avatar_user}`} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                                    ) : (
                                                        review.name_user ? review.name_user.charAt(0).toUpperCase() : 'U'
                                                    )}
                                                </div>
                                            </a>
                                            <div className="media-body">
                                                <h4 className="media-heading" style={{fontSize: '16px', fontWeight: 'bold'}}>{review.name_user || 'Khách hàng'}</h4>
                                                <div style={{margin: '5px 0'}}>
                                                    {renderStars(review.rating)}
                                                    <span style={{fontSize: '12px', color: '#999', marginLeft: '10px'}}><i className="fa fa-clock-o"></i> {date}</span>
                                                </div>
                                                <p style={{marginTop: '10px'}}>{review.comment}</p>
                                            </div>
                                        </li>
                                    );
                                }) : (
                                    <p>Chưa có đánh giá nào phù hợp bộ lọc.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductDetail;
