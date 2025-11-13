import { Link, useNavigate } from 'react-router-dom';
import styles from './CreateProduct.module.scss';
import classNames from 'classnames/bind';
import apiAdmin from '../../../../API/apiAdmin';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
const cx = classNames.bind(styles);
function CreateProduct() {
    const navigate = useNavigate();

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

    const handleSubmit = async () => {
        try {
            console.log(image);

            const formData = new FormData();
            formData.append('name', name);
            formData.append('id_category', category);
            formData.append('id_brand', brand);
            formData.append('price', price);
            formData.append('sale', sale);
            formData.append('qualty', quality);
            formData.append('detail', detail);
            for (let i = 0; i < image.length; i++) {
                formData.append('image', image[i]);
            }

            await apiAdmin.post('/product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Thêm sản phẩm thành công!');
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
                <span>/thêm sản phẩm mới</span>
            </div>
            <div className={cx('create-product')}>
                <h2 className={cx('title')}>Tạo sản phẩm mới</h2>
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
                                {image.map((file, index) => (
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(file)}
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
                            <button className={cx('btn-submit')} onClick={handleSubmit}>
                                Thêm sản phẩm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateProduct;
