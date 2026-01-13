import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './UpdateProduct.module.scss';
import classNames from 'classnames/bind';
import apiAdmin from '../../../../API/apiAdmin';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TiDelete } from 'react-icons/ti';
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
    const [imageDelete, setImageDelete] = useState([]);

    useEffect(() => {
        if (data) {
            setName(data.name || '');
            setCategory(data.id_category?._id || '');
            setBrand(data.id_brand?._id || '');
            setPrice(data.price || 0);
            setSale(data.sale || 0);
            setQuality(data.quantity || 0);
            setImage(JSON.parse(data.image) || []);
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

    const handleImage = (e) => {
        const newFiles = Array.from(e.target.files);
        const total = image.length + newFiles.length;

        if (total > 3) {
            toast.error('Chỉ được chọn tối đa 3 ảnh');
            return;
        }
        setImage((prev) => [...prev, ...newFiles]);
    };
    const removeImage = (img, index) => {
        if (typeof img === 'string') {
            setImageDelete((prev) => [...prev, img]);
        }
        setImage((prev) => prev.filter((_, i) => i !== index));
    };
    console.log(image.length);
    console.log('deleted:', imageDelete.length);

    const handleSubmit = async (id) => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('id_category', category);
            formData.append('id_brand', brand);
            formData.append('price', price);
            formData.append('sale', sale);
            formData.append('quantity', quality);
            formData.append('detail', detail);
            if (Array.isArray(image)) {
                image.forEach((file) => {
                    if (file instanceof File) {
                        formData.append('image', file);
                    }
                });
            }
            if (imageDelete.length > 0) {
                formData.append('imageDelete', JSON.stringify(imageDelete));
            }
            await apiAdmin.put(`/product/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Cập nhật sản phẩm thành công!');
            navigate('/admin/product-list');
        } catch (error) {
            console.log('Update error:', error.response?.data || error);
            const errors = error.response?.data?.errors;
            if (errors) {
                Object.values(errors).forEach((msg) => {
                    toast.error(msg);
                });
            } else {
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!');
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('back')}>
                <Link className={cx('back-list')} to={'/admin/product-list'}>
                    Danh sách sản phẩm
                </Link>
                <span> / Cập nhật sản phẩm</span>
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
                                name="quantity"
                                value={quality}
                                onChange={(e) => setQuality(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={cx('form-right')}>
                        <div className={cx('form-group')}>
                            <label>Ảnh sản phẩm</label>
                            <input type="file" multiple accept="image/*" onChange={handleImage} />
                            <div className={cx('box-preview')}>
                                {(Array.isArray(image) ? image : [image]).map((file, index) => (
                                    <div key={index} className={cx('preview-wrapper')}>
                                        <img
                                            src={
                                                file instanceof File
                                                    ? URL.createObjectURL(file)
                                                    : `http://localhost:3001/${file}`
                                            }
                                            alt="preview"
                                            className={cx('preview')}
                                        />
                                        <span className={cx('box-icon')} onClick={() => removeImage(file, index)}>
                                            <TiDelete className={cx('icon-remove')} />
                                        </span>
                                    </div>
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
