import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import { FaGlobeAsia, FaSignOutAlt, FaRegListAlt, FaShippingFast } from 'react-icons/fa';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { TbCategoryFilled } from 'react-icons/tb';
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
                <li className={cx('sidebar-menu-item')}>
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) => cx('sidebar-menu-link', { active: isActive })}
                    >
                        <FaMoneyBillTrendUp className={cx('icon')} />
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li className={cx('sidebar-menu-item')}>
                    <NavLink
                        to="/admin/order-list"
                        className={({ isActive }) => cx('sidebar-menu-link', { active: isActive })}
                    >
                        <FaShippingFast className={cx('icon')} />
                        <span>Đơn hàng</span>
                    </NavLink>
                </li>
                <li className={cx('sidebar-menu-item')}>
                    <NavLink
                        to="/admin/product-list"
                        className={({ isActive }) => cx('sidebar-menu-link', { active: isActive })}
                    >
                        <FaRegListAlt className={cx('icon')} />
                        <span>Sản phẩm</span>
                    </NavLink>
                </li>
                <li className={cx('sidebar-menu-item')}>
                    <NavLink
                        to="/admin/category"
                        className={({ isActive }) => cx('sidebar-menu-link', { active: isActive })}
                    >
                        <TbCategoryFilled className={cx('icon')} />
                        <span>Danh mục</span>
                    </NavLink>
                </li>
                <li className={cx('sidebar-menu-item')}>
                    <NavLink
                        to="/admin/brand"
                        className={({ isActive }) => cx('sidebar-menu-link', { active: isActive })}
                    >
                        <FaGlobeAsia className={cx('icon')} />
                        <span>Thương hiệu</span>
                    </NavLink>
                </li>
                <li className={cx('sidebar-menu-item')}>
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
