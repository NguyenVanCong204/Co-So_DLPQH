import React, { useEffect, useState } from 'react';
import apiMember from '../../API/apiMember';
import { Link, useLocation } from 'react-router-dom';
import './LeftSide.css';

function LeftSide() {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        brand: '',
        category: ''
    });
    const [msg, setMsg] = useState('');
    const [maxDbPrice, setMaxDbPrice] = useState(0);
    const location = useLocation();

    useEffect(() => {
        setFilters({
            minPrice: '',
            maxPrice: '',
            brand: '',
            category: ''
        });
        setMsg('');
    }, [location.pathname]);

    useEffect(() => {
        apiMember.get('/category')
            .then(res => {
                if(Array.isArray(res.data.data)) setCategories(res.data.data);
            })
            .catch(err => console.error(err));

        apiMember.get('/brand')
            .then(res => {
                if(Array.isArray(res.data.data)) setBrands(res.data.data);
            })
            .catch(err => console.error(err));

        apiMember.get('/product')
            .then(res => {
                if(Array.isArray(res.data.data)) {
                     const products = res.data.data;
                     if(products.length > 0) {
                         const max = Math.max(...products.map(p => p.price));
                         setMaxDbPrice(max);
                     }
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleFilterSubmit = () => {
        if (filters.minPrice === '' && filters.maxPrice === '') {
            setMsg('Vui lòng nhập khoảng giá mong muốn!');
            return;
        }
        if (filters.minPrice === '' || filters.maxPrice === '') {
            setMsg('Vui lòng nhập đầy đủ giá "Từ" và "Đến"!');
            return;
        }

        const min = parseInt(filters.minPrice);
        const max = parseInt(filters.maxPrice);

        if (min < 0 || max < 0) {
            setMsg('Không thể nhập giá âm!');
            return;
        }
        
        if (min > max) {
            setMsg('Giá "Từ" phải nhỏ hơn hoặc bằng giá "Đến"!');
            return;
        }
        
        if (min > maxDbPrice) {
             setMsg(`Giá nhập vào (${min.toLocaleString('vi-VN')}đ) vượt quá giá sản phẩm cao nhất hiện có (${maxDbPrice.toLocaleString('vi-VN')}đ). Không có sản phẩm nào.`);
        } else {
             setMsg('Đã áp dụng bộ lọc thành công!');
             setTimeout(() => setMsg(''), 3000);
        }

        const event = new CustomEvent('product-filter', { detail: filters });
        window.dispatchEvent(event);
    }

    const handleReset = () => {
        const resetFilters = { minPrice: '', maxPrice: '', brand: '', category: '' };
        setFilters(resetFilters);
        setMsg('');
        const event = new CustomEvent('product-filter', { detail: resetFilters });
        window.dispatchEvent(event);
    }
    
    // 5000000 -> 5.000.000
    const formatNumber = (num) => {
        if (!num && num !== 0) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // 5.000.000 -> 5000000
    const parseNumber = (str) => {
        if (!str) return '';
        return str.toString().replace(/\./g, "");
    };

    const handlePriceChange = (e, source) => {
        const rawValue = parseNumber(e.target.value);
        
        if (rawValue && !/^\d+$/.test(rawValue)) return;

        const val = rawValue ? parseInt(rawValue) : '';
        
        if(val && val < 0) {
             setMsg('Cảnh báo: Không được nhập số âm');
        } else {
             if(msg.includes('số âm')) setMsg('');
        }
        
        setFilters(prev => ({ ...prev, [source]: val }));
    };

    const handlePriceIncrement = (source, amount) => {
        setFilters(prev => {
            const current = prev[source] ? parseInt(prev[source]) : 0;
            const newVal = current + amount;
            if (newVal < 0) return prev;
            return { ...prev, [source]: newVal };
        });
    }
    
    const handleBrandClick = (id) => {
        const newFilters = { ...filters, brand: id };
        setFilters(newFilters);
        const event = new CustomEvent('product-filter', { detail: newFilters });
        window.dispatchEvent(event);
    };

    const handleCategoryClick = (id) => {
        const newFilters = { ...filters, category: id };
        setFilters(newFilters);
        const event = new CustomEvent('product-filter', { detail: newFilters });
        window.dispatchEvent(event);
    };

    return (
        <div className="col-sm-3">
            <div className="left-sidebar">
                <h2>BỘ LỌC TÌM KIẾM</h2>
                
                {/* Price Range */}
                <div className="panel-group category-products">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">Chọn khoảng giá</h4>
                        </div>
                        <div className="panel-body price-filter-body">
                           {msg && <div className="alert alert-info" style={{fontSize: '12px', padding: '5px', marginBottom: '10px'}}>{msg}</div>}
                           
                           <div className="form-group">
                                <label>Từ:</label>
                                <div className="input-group-custom">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formatNumber(filters.minPrice)}
                                        placeholder="Ví dụ: 100.000"
                                        onChange={(e) => handlePriceChange(e, 'minPrice')}
                                    />
                                    <div className="spin-btns">
                                        <button className="spin-up" onClick={() => handlePriceIncrement('minPrice', 500000)}><i className="fa fa-caret-up"></i></button>
                                        <button className="spin-down" onClick={() => handlePriceIncrement('minPrice', -500000)}><i className="fa fa-caret-down"></i></button>
                                    </div>
                                </div>
                           </div>
                           <div className="form-group">
                                <label>Đến:</label>
                                <div className="input-group-custom">
                                     <input
                                        type="text"
                                        className="form-control"
                                        value={formatNumber(filters.maxPrice)}
                                        placeholder="Ví dụ: 5.000.000"
                                        onChange={(e) => handlePriceChange(e, 'maxPrice')}
                                    />
                                    <div className="spin-btns">
                                        <button className="spin-up" onClick={() => handlePriceIncrement('maxPrice', 500000)}><i className="fa fa-caret-up"></i></button>
                                        <button className="spin-down" onClick={() => handlePriceIncrement('maxPrice', -500000)}><i className="fa fa-caret-down"></i></button>
                                    </div>
                                </div>
                           </div>
                           <div className="filter-buttons">
                               <button className="btn btn-primary btn-filter" onClick={handleFilterSubmit}>
                                    Lọc
                               </button>
                               <button className="btn btn-reset" onClick={handleReset}>
                                    Đặt lại
                               </button>
                           </div>
                        </div>
                    </div>
                </div>

                {/* Brands */}
                <div className="brands_products">
                    <h2>THƯƠNG HIỆU</h2>
                    <div className="brands-name">
                        <ul className="nav nav-pills nav-stacked">
                            <li>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleBrandClick('') }}>
                                    <span className="pull-right"></span>Tất cả
                                </a>
                            </li>
                            {brands.map(brand => (
                                <li key={brand._id} className={filters.brand === brand._id ? 'active' : ''}>
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleBrandClick(brand._id) }}>
                                        <span className="pull-right"></span>{brand.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeftSide;
