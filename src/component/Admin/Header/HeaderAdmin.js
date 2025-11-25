import { useEffect, useState } from 'react';
import styles from './HeaderAdmin.module.scss';
import classNames from 'classnames/bind';
import apiAdmin from '../../../API/apiAdmin';

const cx = classNames.bind(styles);
const HeaderAdmin = () => {
    const [user, setUser] = useState({});

    const idUser = localStorage.getItem('IdUser');
    useEffect(() => {
        apiAdmin
            .get(`/user/${idUser}`)
            .then((res) => setUser(res.data))
            .catch((err) => console.log(err));
    }, [idUser]);
    return (
        <header className={cx('wrapper')}>
            <div className={cx('header-left')}>
                <input type="text" className={cx('search-input')} placeholder="Tìm kiếm..." />
            </div>
            <div className={cx('header-right')}>
                <img className={cx('avatar')} src={`http://localhost:3001/${JSON.parse(user.avatar)[0]}`} alt="" />
                <p className={cx('user-name')}>{user.name}</p>
            </div>
        </header>
    );
};

export default HeaderAdmin;
