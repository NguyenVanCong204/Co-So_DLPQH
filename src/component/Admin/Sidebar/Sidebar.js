import { Link, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import { FaUser, FaGlobeAsia, FaSignOutAlt, FaRegListAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);
const Sidebar = () => {
    const navigate = useNavigate();
    function Logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenRefresh');
        localStorage.removeItem('adminId');
        navigate('/admin/login');
        toast.success('Đăng xuất thành công');
    }
    return (
        <div className={cx('sidebar')}>
            <ul className={cx('sidebar-menu')}>
                <li>
                    <Link to="/admin/order-list">
                        <FaRegListAlt className={cx('icon')} />
                        <span>Đơn hàng</span>
                    </Link>
                </li>
                <li>
                    <a href="/admin/product-list">
                        <FaRegListAlt className={cx('icon')} />
                        <span>Sản phẩm</span>
                    </a>
                </li>
                <li>
                    <Link to="/dashboard/update/admin">
                        <FaUser className={cx('icon')} />
                        <span>Người dùng</span>
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/country/list">
                        <FaGlobeAsia className={cx('icon')} />
                        <span>Danh mục</span>
                    </Link>
                </li>
                <li>
                    <a onClick={() => Logout()}>
                        <FaSignOutAlt className={cx('icon')} />
                        <span>Đăng xuất</span>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
