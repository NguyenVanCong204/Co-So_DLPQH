import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import auth from '../../../../API/auth';
import styles from './LoginTest.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function LoginTest() {
    const navigate = useNavigate();
    let [err, SetErr] = useState({});
    const [input, SetInput] = useState({
        email: '',
        password: '',
        level: '1',
    });
    function handleChangInput(e) {
        let name = e.target.name;
        let value = e.target.value;
        SetInput((states) => ({ ...states, [name]: value }));
    }
    function checkInput(e) {
        e.preventDefault();
        let errAll = {};
        let check = true;
        if (input.email === '') {
            errAll.email = 'Vui lòng nhập email';
            check = false;
        }
        if (input.password === '') {
            errAll.password = 'Vui lòng nhập password';
            check = false;
        }
        if (input.level === '') {
            errAll.level = 'Vui lòng chọn người dùng đăng nhập';
            check = false;
        }
        if (!check) {
            SetErr(errAll);
        } else {
            const data = {
                email: input.email,
                password: input.password,
                level: input.level,
            };
            auth.post('login', data)
                .then((res) => {
                    SetErr({});
                    localStorage.setItem('adminId', res.data.user._id);
                    localStorage.setItem('adminToken', res.data.token);
                    localStorage.setItem('adminTokenRefresh', res.data.tokenRefresh);
                    navigate('/admin/product-list');
                    toast.success('Đăng nhập thành công');
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.message) {
                        toast.error(error.response.data.message);
                        console.log(error.response.data.message);
                        errAll.api = error.response.data.message;
                        SetErr(errAll);
                    } else {
                        console.error('Lỗi không xác định:', error);
                    }
                });
        }
    }
    return (
        <div className={cx('login-background')}>
            <div className={cx('login-container')}>
                <div className={cx('login-content', 'row')}>
                    <div className={cx('col-12', 'text-center', 'text-login')}>Đăng Nhập</div>
                    <div className={cx('col-12', 'form-group', 'login-input')}>
                        <label>Email:</label>
                        <input
                            name="email"
                            type="text"
                            className={cx('form-control')}
                            placeholder="Nhập email của bạn"
                            onChange={(e) => handleChangInput(e)}
                        />
                    </div>
                    <p>{err.email}</p>
                    <div className={cx('col-12', 'form-group', 'login-input')}>
                        <label>Mật khẩu:</label>
                        <div className={cx('custom-input-password')}>
                            <input
                                name="password"
                                type="password"
                                className={cx('form-control')}
                                placeholder="Nhập mật khẩu của bạn"
                                onChange={(e) => handleChangInput(e)}
                            />
                            <span>
                                <i className={cx('fa-regular fa-eye')}></i>
                            </span>
                        </div>
                    </div>
                    <p>{err.password}</p>
                    <select name="level" className={cx('level')}>
                        <option value="1">Admin</option>
                    </select>
                    <div className={cx('col-12', '')} style={{ color: 'red' }}></div>
                    <div className={cx('col-12', '')}>
                        <button className={cx('btn-login')} onClick={(e) => checkInput(e)}>
                            Đăng Nhập
                        </button>
                    </div>
                    <div className={cx('col-12', '')}>
                        <Link to="/admin/register">
                            <button className={cx('btn-register')}>Đăng Kí</button>
                        </Link>
                    </div>
                    <div className={cx('col-12', '')}>
                        <span className={cx('forgot-password')}>Quên mật khẩu của bạn?</span>
                    </div>
                    <div className={cx('col-12', 'text-center', 'mt-3')}>
                        <span className={cx('text-other-login')}>Đăng nhập bằng:</span>
                    </div>
                    <div className={cx('col-12', 'social-login')}>
                        <i className={cx('fa-brands', 'fa-google-plus-g', 'gogle')}></i>
                        <i className={cx('fa-brands', 'fa-facebook-f', 'facebook')}></i>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LoginTest;
