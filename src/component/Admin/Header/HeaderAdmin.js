import { useEffect, useState } from 'react';
import styles from './HeaderAdmin.module.scss';
import classNames from 'classnames/bind';
import apiAdmin from '../../../API/apiAdmin';

const cx = classNames.bind(styles);
const HeaderAdmin = () => {
    const [user, setUser] = useState({});

    const idUser = localStorage.getItem('IdUser');
    useEffect(() => {
        if (idUser) {
            apiAdmin
                .get(`/user/${idUser}`)
                .then((res) => setUser(res.data))
                .catch((err) => console.log(err));
        }
    }, [idUser]);

    const getAvatarSrc = () => {
        if (!user || !user.avatar) {
            return 'http://localhost:3001/no-image.png';
        }
        try {
            const avatar = typeof user.avatar === 'string' ? JSON.parse(user.avatar) : user.avatar;
            if (Array.isArray(avatar) && avatar.length > 0) {
                return `http://localhost:3001/${avatar[0]}`;
            }
            return `http://localhost:3001/${user.avatar}`;
        } catch (error) {
            return `http://localhost:3001/${user.avatar}`;
        }
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('header-left')}>
                <input type="text" className={cx('search-input')} placeholder="Tìm kiếm..." />
            </div>
            <div className={cx('header-right')}>
                <img className={cx('avatar')} src={getAvatarSrc()} alt="" />
                <p className={cx('user-name')}>{user.name || 'Admin'}</p>
            </div>
        </header>
    );
};

export default HeaderAdmin;
