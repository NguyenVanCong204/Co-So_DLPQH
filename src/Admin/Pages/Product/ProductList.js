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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [checkedItems, setCheckedItems] = useState([]);
    const [action, setAction] = useState('');
    const [count, setCount] = useState(0);

    const isCheckedAll = checkedItems.length === data.length && data.length > 0;
    const handleCheckedAll = (e) => {
        if (e.target.checked) {
            setCheckedItems(data.map((item) => item._id));
        } else {
            setCheckedItems([]);
        }
    };
    const handleCheckedItem = (id) => {
        setCheckedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
    };

    const fetchData = (currentPage) => {
        apiAdmin
            .get(`/product?page=${currentPage}&limit=8`)
            .then((res) => {
                setData(res.data.data);
                setTotalPages(res.data.totalPages);
            })
            .catch((err) => console.log(err));
    };
    const fetchCount = () => {
        apiAdmin
            .get('/trash-product/count')
            .then((res) => {
                setCount(res.data);
            })
            .catch((err) => console.log(err));
    };
    useEffect(() => {
        fetchData(page);
        fetchCount();
    }, [page]);

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
                fetchCount();
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleSubmit = async () => {
        try {
            switch (action) {
                case 'Delete':
                    const result = await Swal.fire({
                        title: 'Xóa sản phẩm',
                        text: 'Bạn có chắc chắn muốn xóa các sản phẩm này?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Xóa',
                        cancelButtonText: 'Hủy',
                    });
                    if (result.isConfirmed) {
                        await apiAdmin.delete('/product/delete-many', {
                            data: { ids: checkedItems },
                            headers: {
                                Accept: 'Application/json',
                                'Content-Type': 'application/json',
                            },
                        });
                        setData((prev) => prev.filter((item) => !checkedItems.includes(item._id)));
                        toast.success('Sản phẩm đã được đưa vào thùng rác!');
                    }
                    break;

                default:
                    break;
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
                        <select
                            className={cx('action-select')}
                            required
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                        >
                            <option value="">-- Chọn hành động --</option>
                            <option value="Delete">Xóa</option>
                        </select>
                        <button
                            className={cx('action-perform')}
                            disabled={checkedItems.length === 0 || !action}
                            onClick={handleSubmit}
                        >
                            Thực hiện
                        </button>
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
                                    <input type="checkbox" checked={isCheckedAll} onChange={handleCheckedAll} />
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
                                        <input
                                            type="checkbox"
                                            value={item._id}
                                            checked={checkedItems.includes(item._id)}
                                            onChange={() => handleCheckedItem(item._id)}
                                        />
                                    </td>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.id_brand.name}</td>
                                    <td>{item.id_category.name}</td>
                                    <td>{item.price.toLocaleString('vi-VN')}</td>
                                    <td>{item.quantity}</td>
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
                {/* Pagination */}
                <div className={cx('pagination')}>
                    <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i} className={cx({ active: page === i + 1 })} onClick={() => setPage(i + 1)}>
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
                <div className={cx('trash')}>
                    <Link to={'/admin/product/trash-product'} className={cx('trash-box')}>
                        <span className={cx('trash-quality')}>{count}</span>
                        <CiTrash className={cx('trash-icon')} />
                    </Link>
                </div>
            </div>
        </>
    );
}

export default ProductList;
