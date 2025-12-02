import styles from './Category.module.scss';
import classNames from 'classnames/bind';
import { ImCancelCircle } from 'react-icons/im';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import apiAdmin from '../../../API/apiAdmin';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Category() {
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [editId, setEditId] = useState(null);
    const [cancel, setCancel] = useState(false);

    useEffect(() => {
        apiAdmin
            .get('/category')
            .then((res) => setData(res.data.data))
            .catch((error) => console.log(error));
    }, []);
    const handleSubmit = async () => {
        try {
            const res = await apiAdmin.post('/category', { name });
            setName('');
            toast.success('Thêm danh mục thành công!');
            setData((prev) => [...prev, res.data.data]);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = async (item) => {
        setEditId(item._id);
        setName(item.name);
        setCancel(true);
    };
    const handleCancel = () => {
        setEditId(null);
        setCancel(false);
        setName('');
    };
    const handleSubmitUpdate = async () => {
        try {
            await apiAdmin.put(`/category/update/${editId}`, { name });
            setData((prev) => prev.map((item) => (item._id === editId ? { ...item, name } : item)));
            toast.success('Cập nhật thành công!');
            setName('');
            setEditId(null);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Xóa danh mục',
                text: 'Bạn có chắc chắn muốn xóa?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy',
            });
            if (result.isConfirmed) {
                await apiAdmin.delete(`/category/delete/${id}`);
                setData((prev) => prev.filter((item) => item._id !== id));
                toast.success('Danh mục này đã được đưa vào thùng rác!');
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
                        <label className={cx('label-name')}>Tên danh mục</label>
                        <input className={cx('input-name')} value={name} onChange={(e) => setName(e.target.value)} />
                        {cancel ? (
                            <div className={cx('cancel')} title="Hủy cập nhật">
                                <ImCancelCircle className={cx('icon-cancel')} onClick={handleCancel} />
                            </div>
                        ) : (
                            <span></span>
                        )}
                    </div>
                    <div className={cx('action-btn')}>
                        {editId ? (
                            <button className={cx('btn-update')} onClick={handleSubmitUpdate}>
                                Cập nhật
                            </button>
                        ) : (
                            <button className={cx('btn-add')} onClick={handleSubmit}>
                                Thêm mới
                            </button>
                        )}
                    </div>
                </div>
                <div className={cx('list-product')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Stt</th>
                                <th>Tên danh mục</th>
                                <th>Ghi chú</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td></td>
                                    <td>
                                        <button className={cx('btn-edit')} onClick={() => handleUpdate(item)}>
                                            Chỉnh sửa
                                        </button>
                                        <button className={cx('btn-delete')} onClick={() => handleDelete(item._id)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Category;
