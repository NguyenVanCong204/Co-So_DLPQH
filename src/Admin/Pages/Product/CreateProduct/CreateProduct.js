import { Link, useNavigate } from 'react-router-dom';
import styles from './CreateProduct.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TiDelete } from 'react-icons/ti';

import apiAdmin from '../../../../API/apiAdmin';
const cx = classNames.bind(styles);
function CreateProduct() {
    const navigate = useNavigate();
    const [image, setImage] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [brandList, setBrandList] = useState([]);

    const productSchema = Yup.object().shape({
        name: Yup.string().required('Tên sản phẩm là bắt buộc'),
        id_category: Yup.string().required('Danh mục là bắt buộc'),
        id_brand: Yup.string().required('Thương hiệu là bắt buộc'),
        price: Yup.number().required('Giá là bắt buộc').min(1),
        sale: Yup.number().min(0),
        quantity: Yup.number().required('Số lượng là bắt buộc').min(1),
        detail: Yup.string().required('Chi tiết sản phẩm là bắt buộc'),
    });

    const handleImage = (e) => {
        const newFiles = Array.from(e.target.files);
        if (image.length >= 3) {
            toast.error('Chỉ được chọn tối đa 3 ảnh');
            return;
        }
        setImage((prev) => [...prev, ...newFiles]);
    };

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

    const handleCreate = async (values) => {
        try {
            const formData = new FormData();
            for (let key in values) {
                formData.append(key, values[key]);
            }
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
        <Formik
            initialValues={{
                name: '',
                id_category: '',
                id_brand: '',
                price: '',
                sale: '',
                quantity: '',
                detail: '',
            }}
            validationSchema={productSchema}
            onSubmit={handleCreate}
        >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
                <form className={cx('wrapper')} onSubmit={handleSubmit}>
                    <div className={cx('back')}>
                        <Link className={cx('back-list')} to={'/admin/product-list'}>
                            Danh sách sản phẩm
                        </Link>
                        <span> / thêm sản phẩm mới</span>
                    </div>
                    <div className={cx('create-product')}>
                        <h2 className={cx('title')}>Thêm sản phẩm mới</h2>
                        <div className={cx('form')}>
                            <div className={cx('form-left')}>
                                <div className={cx('form-group')}>
                                    <label>Tên sản phẩm</label>
                                    <input
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        className={cx({ 'input-error': errors.name && touched.name })}
                                    />
                                    {errors.name && touched.name && <p className={cx('error-text')}>{errors.name}</p>}
                                </div>

                                <div className={cx('form-group')}>
                                    <label>Danh mục</label>
                                    <select
                                        name="id_category"
                                        value={values.id_category}
                                        onChange={handleChange}
                                        className={cx({ 'input-error': errors.id_category && touched.id_category })}
                                    >
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
                                    <select
                                        name="id_brand"
                                        value={values.id_brand}
                                        onChange={handleChange}
                                        className={cx({ 'input-error': errors.id_brand && touched.id_brand })}
                                    >
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
                                        value={values.price}
                                        onChange={handleChange}
                                        className={cx({ 'input-error': errors.price && touched.price })}
                                    />
                                    {errors.price && touched.price && (
                                        <p className={cx('error-text')}>{errors.price}</p>
                                    )}
                                </div>

                                <div className={cx('form-group')}>
                                    <label>Giảm giá (%)</label>
                                    <input
                                        type="number"
                                        name="sale"
                                        value={values.sale}
                                        onChange={handleChange}
                                        className={cx({ 'input-error': errors.sale && touched.sale })}
                                    />
                                    {errors.sale && touched.sale && <p className={cx('error-text')}>{errors.sale}</p>}
                                </div>
                            </div>

                            <div className={cx('form-right')}>
                                <div className={cx('form-group')}>
                                    <label>Số lượng</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={values.quantity}
                                        onChange={handleChange}
                                        className={cx({ 'input-error': errors.quantity && touched.quantity })}
                                    />
                                    {errors.quantity && touched.quantity && (
                                        <p className={cx('error-text')}>{errors.quantity}</p>
                                    )}
                                </div>
                                <div className={cx('form-group')}>
                                    <label>
                                        Ảnh sản phẩm <span>({image.length}/3)</span>
                                    </label>
                                    <input type="file" multiple accept="image/*" onChange={handleImage} />
                                    <div className={cx('box-preview')}>
                                        {image.map((file, index) => (
                                            <div key={index} className={cx('preview-wrapper')}>
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="preview"
                                                    className={cx('preview')}
                                                />
                                                <span
                                                    className={cx('box-icon')}
                                                    onClick={() =>
                                                        setImage((prev) => prev.filter((_, i) => i !== index))
                                                    }
                                                >
                                                    <TiDelete className={cx('icon-remove')} />
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={cx('form-group')}>
                                    <label>Chi tiết</label>
                                    <textarea
                                        name="detail"
                                        value={values.detail}
                                        onChange={handleChange}
                                        className={cx({ 'input-error': errors.detail && touched.detail })}
                                    />
                                    {errors.detail && touched.detail && (
                                        <p className={cx('error-text')}>{errors.detail}</p>
                                    )}
                                </div>

                                <div className={cx('actions')}>
                                    <button type="submit" className={cx('btn-submit')}>
                                        Thêm sản phẩm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
}

export default CreateProduct;
