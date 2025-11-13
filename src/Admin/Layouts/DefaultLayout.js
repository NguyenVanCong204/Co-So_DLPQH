import styles from './DefaultLayout.module.scss';
import classNames from 'classnames/bind';
import HeaderAdmin from '../../component/Admin/Header/HeaderAdmin';
import Sidebar from '../../component/Admin/Sidebar/Sidebar';
const cx = classNames.bind(styles);
function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Sidebar />
            <div className={cx('box-content')}>
                <HeaderAdmin />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
