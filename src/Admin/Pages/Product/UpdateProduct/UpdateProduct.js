import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './UpdateProduct.module.scss';
import classNames from 'classnames/bind';
import apiAdmin from '../../../../API/apiAdmin';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
const cx = classNames.bind(styles);
function UpdateProduct() {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state.data;
    const id = data._id;

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState(0);
    const [sale, setSale] = useState(0);
    const [quality, setQuality] = useState(0);
    const [image, setImage] = useState([]);
    const [detail, setDetail] = useState('');

    const [categoryList, setCategoryList] = useState([]);
    const [brandList, setBrandList] = useState([]);

    useEffect(() => {
        if (data) {
            setName(data.name || '');
            setCategory(data.id_category?._id || '');
            setBrand(data.id_brand?._id || '');
            setPrice(data.price || 0);
            setSale(data.sale || 0);
            setQuality(data.qualty || 0);
            setImage(data.image || []);
            setDetail(data.detail || '');
        }
    }, [data]);

    const getCategory = () => {
        apiAdmin
            .get('/category')
            .then((res) => {
                setCategoryList(res.data.data);
            })
            .catch();
    };
    const getBrand = () => {
        apiAdmin
            .get('/brand')
            .then((res) => {
                setBrandList(res.data.data);
            })
            .catch();
    };
    useEffect(() => {
        getCategory();
        getBrand();
    }, []);

    const handleSubmit = async (id) => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('id_category', category);
            formData.append('id_brand', brand);
            formData.append('price', price);
            formData.append('sale', sale);
            formData.append('qualty', quality);
            formData.append('image', image);
            formData.append('detail', detail);
            await apiAdmin.put(`/product/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Cập nhật sản phẩm thành công!');
            navigate('/admin/product-list');
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('back')}>
                <Link className={cx('back-list')} to={'/admin/product-list'}>
                    Danh sách sản phẩm
                </Link>
                <span>/Cập nhật sản phẩm</span>
            </div>
            <div className={cx('create-product')}>
                <h2 className={cx('title')}>Cập nhật sản phẩm</h2>
                <div className={cx('form')}>
                    <div className={cx('form-left')}>
                        <div className={cx('form-group')}>
                            <label>Tên sản phẩm</label>
                            <input name="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className={cx('form-group')}>
                            <label>Danh mục</label>
                            <select name="id_category" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">-- Chọn danh mục --</option>
                                {categoryList.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={cx('form-group')}>
                            <label>Thương hiệu</label>
                            <select name="id_brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
                                <option value="">-- Chọn thương hiệu --</option>
                                {brandList.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={cx('form-group')}>
                            <label>Giá</label>
                            <input
                                type="number"
                                name="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label>Giảm giá (%)</label>
                            <input type="number" name="sale" value={sale} onChange={(e) => setSale(e.target.value)} />
                        </div>

                        <div className={cx('form-group')}>
                            <label>Số lượng</label>
                            <input
                                type="number"
                                name="qualty"
                                value={quality}
                                onChange={(e) => setQuality(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={cx('form-right')}>
                        <div className={cx('form-group')}>
                            <label>Ảnh sản phẩm</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                    const newFiles = Array.from(e.target.files);
                                    setImage((prev) => [...prev, ...newFiles]);
                                }}
                            />
                            <div className={cx('box-preview')}>
                                {(Array.isArray(image) ? image : [image]).map((file, index) => (
                                    <img
                                        key={index}
                                        src={
                                            file instanceof File
                                                ? URL.createObjectURL(file)
                                                : `http://localhost:3001/uploads/product/${file}`
                                        }
                                        alt="preview"
                                        className={cx('preview')}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label>Chi tiết</label>
                            <textarea name="detail" value={detail} onChange={(e) => setDetail(e.target.value)} />
                        </div>

                        <div className={cx('actions')}>
                            <button className={cx('btn-submit')} onClick={() => handleSubmit(id)}>
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;
