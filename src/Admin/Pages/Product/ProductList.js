import styles from './ProductList.module.scss';
import classNames from 'classnames/bind';
import { IoMdAdd } from 'react-icons/io';
import { CiTrash } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import apiAdmin from '../../../API/apiAdmin';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function ProductList() {
    const [data, setData] = useState([]);
    useEffect(() => {
        apiAdmin.get('/product').then((res) => {
            setData(res.data.data);
        });
    }, []);

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Xóa sản phẩm?',
                text: 'Bạn có chắc chắn muốn xóa?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy',
            });
            if (result.isConfirmed) {
                await apiAdmin.delete(`/product/delete/${id}`);
                setData((prev) => prev.filter((item) => item._id !== id));
                toast.success('Sản phẩm đã được đưa vào thùng rác!');
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('action')}>
                    <div className={cx('action-box')}>
                        <select className={cx('action-select')}>
                            <option value="">-- Chọn hành động --</option>
                            <option value="Delete">Xóa</option>
                        </select>
                        <button className={cx('action-perform')}>Thực hiện</button>
                    </div>
                    <div className={cx('action-btn')}>
                        <Link to={'/admin/product/create-product'} className={cx('btn-add')}>
                            <span className={cx('icon-add')}>
                                <IoMdAdd />
                            </span>
                            Thêm mới
                        </Link>
                    </div>
                </div>
                <div className={cx('list-product')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" />
                                </th>
                                <th>STT</th>
                                <th>Tên sản phẩm</th>
                                <th>Thương hiệu</th>
                                <th>Danh mục</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Ảnh sản phẩm</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={item._id}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.id_brand.name}</td>
                                    <td>{item.id_category.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.qualty}</td>
                                    <td>
                                        <img
                                            className={cx('image')}
                                            src={`http://localhost:3001/${JSON.parse(item.image)[0]}`}
                                            alt=""
                                        />
                                    </td>
                                    <td>
                                        <Link
                                            to={'/admin/product/update-product'}
                                            className={cx('btn-edit')}
                                            state={{ data: item }}
                                        >
                                            Chỉnh sửa
                                        </Link>
                                        <button className={cx('btn-delete')} onClick={() => handleDelete(item._id)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={cx('trash')}>
                    <div className={cx('trash-box')}>
                        <span className={cx('trash-quality')}>3</span>
                        <CiTrash className={cx('trash-icon')} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductList;
