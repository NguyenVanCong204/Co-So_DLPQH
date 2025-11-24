import styles from './TrashProduct.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiAdmin from '../../../../API/apiAdmin';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
const cx = classNames.bind(styles);
function TrashProduct() {
    const [data, setData] = useState([]);
    const fetchData = () => {
        apiAdmin
            .get('/trash-product')
            .then((res) => {
                setData(res.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const handleRestore = async (id) => {
        try {
            const result = await apiAdmin.patch(`/trash-product/restore/${id}`);
            if (result) {
                setData((prev) => prev.filter((item) => item._id !== id));
                toast.success('Khôi phục sản phẩm thành công!');
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleForceDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Xóa vĩnh viễn',
                text: 'Bạn có chắc chắn muốn xóa vĩnh viễn?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy',
            });
            if (result.isConfirmed) {
                await apiAdmin.delete(`/trash-product/force-delete/${id}`);
                setData((prev) => prev.filter((item) => item._id !== id));
                toast.success('Sản phẩm đã được xóa vĩnh viễn!');
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            <div className={cx('action')}>
                <div className={cx('back')}>
                    <Link className={cx('back-list')} to={'/admin/product-list'}>
                        Danh sách sản phẩm
                    </Link>
                    <span> / thùng rác</span>
                </div>
            </div>
            <div className={cx('wrapper')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
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
                                    <button className={cx('btn-edit')} onClick={() => handleRestore(item._id)}>
                                        Khôi phục
                                    </button>
                                    <button className={cx('btn-delete')} onClick={() => handleForceDelete(item._id)}>
                                        Xóa vĩnh viễn
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default TrashProduct;
