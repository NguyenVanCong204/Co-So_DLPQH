import { useState } from 'react';
import auth from '../../../../API/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterTest.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function RegisterTest() {
    const navigate = useNavigate();
    let [input, SetInput] = useState({
        email: '',
        name: '',
        pass: '',
        phone: '',
        address: '',
        level: 1,
        avatar: [],
    });
    let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
    };
    let [err, SetErr] = useState({});
    function handleChangInput(e) {
        let name = e.target.name;
        let value = e.target.value;
        SetInput((states) => ({ ...states, [name]: value }));
    }
    function handleChangInputFile(e) {
        let files = Array.from(e.target.files);
        let name = e.target.name;
        SetInput((states) => ({ ...states, [name]: files }));
    }
    function CheckInput(e) {
        e.preventDefault();
        let errAll = {};
        let chek = true;
        let allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        if (input.email == '') {
            errAll.email = 'Vui lòng nhập email';
            chek = false;
        } else {
            if (!emailRegex.test(input.email)) {
                errAll.email = 'Email không hợp lệ';
                chek = false;
            }
        }
        if (input.name == '') {
            errAll.name = 'Vui lòng nhập name';
            chek = false;
        }
        if (input.pass == '') {
            errAll.pass = 'Vui lòng nhập pass';
            chek = false;
        }
        if (input.phone == '') {
            errAll.phone = 'Vui lòng nhập phone';
            chek = false;
        } else {
            if (!phoneRegex.test(input.phone)) {
                errAll.phone = 'Số điện thoại không hợp lệ';
                chek = false;
            }
        }
        if (input.address == '') {
            errAll.address = 'Vui lòng nhập address';
            chek = false;
        }
        if (input.avatar.length <= 0) {
            errAll.files = 'Vui lòng chọn files';
            chek = false;
        }
        if (input.avatar.length > 3) {
            errAll.files = 'Chỉ chọn được tối đa 3 files';
            chek = false;
        } else {
            input.avatar.map((value, index) => {
                console.log('File type:', value.type);
                if (value.size > 1024 * 1024) {
                    errAll.files = 'Vui lòng chọn ảnh nhỏ hơn 1mb';
                    chek = false;
                }
                if (!allowedTypes.includes(value.type)) {
                    errAll.files = 'Vui lòng chọn đúng định dạng files';
                    chek = false;
                }
            });
        }
        if (!chek) {
            SetErr(errAll);
        } else {
            let data = new FormData();
            data.append('name', input.name);
            data.append('email', input.email);
            data.append('password', input.pass);
            data.append('phone', input.phone);
            data.append('address', input.address);
            data.append('level', input.level);
            input.avatar.map((value, index) => {
                data.append('avatar', value);
            });
            auth.post('/register', data, config)
                .then((res) => {
                    SetErr({});
                    toast.success('Đăng kí thành công');
                    navigate('/admin/login');
                    console.log(res);
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        const message =
                            error.response.data?.error ||
                            error.response.data?.errors ||
                            error.response.data?.message ||
                            error.message;
                        console.log(error);
                        if (typeof message === 'object' && message !== null) {
                            const keys = Object.keys(message);
                            if (keys.length > 0) {
                                const firstKey = keys[0];
                                toast.error('Lỗi khi đăng kí : ' + message[firstKey]);
                            }
                        } else {
                            toast.error('Lỗi khi đăng kí : ' + message);
                        }
                        SetErr(errAll);
                    } else {
                        console.error('Lỗi không xác định:', error);
                        toast.error('Lỗi không xác định:', error);
                    }
                });
        }
    }
    return (
        <div className={cx('register-background')}>
            <div className={cx('register-container')}>
                <div className={cx('register-content', 'row')}>
                    <div className={cx('col-12', ' text-center ', ' Register')}>Đăng Kí</div>
                    <form encType="multipart/form-data">
                        <div className={cx('col-12', ' form-group', 'Email')}>
                            <label>Email:</label>
                            <input
                                type="text"
                                name="email"
                                className={cx('form-control')}
                                placeholder="Nhập email của bạn"
                                onChange={(e) => handleChangInput(e)}
                            />
                        </div>
                        <p>{err.email}</p>
                        <div className={cx('col-12', ' form-group', 'Password')}>
                            <label>Name:</label>
                            <input
                                name="name"
                                type="text"
                                className={cx('form-control')}
                                placeholder="Nhập tên của bạn"
                                onChange={(e) => handleChangInput(e)}
                            />
                        </div>
                        <p>{err.name}</p>
                        <div className={cx('col-12', ' form-group', 'confirm-password')}>
                            <label>Password:</label>
                            <input
                                name="pass"
                                type="password"
                                className={cx('form-control')}
                                placeholder="Nhập mật khẩu của bạn"
                                onChange={(e) => handleChangInput(e)}
                            />
                        </div>
                        <p>{err.pass}</p>
                        <div className={cx('col-12', ' form-group', 'name')}>
                            <label>Phone:</label>
                            <input
                                name="phone"
                                type="text"
                                className={cx('form-control')}
                                placeholder="Nhập Phone của bạn"
                                onChange={(e) => handleChangInput(e)}
                            />
                        </div>
                        <p>{err.phone}</p>
                        <div className={cx('col-12', ' form-group', 'birthday')}>
                            <label>Address:</label>
                            <input
                                name="address"
                                type="text"
                                className={cx('form-control')}
                                placeholder="Nhập address của bạn"
                                onChange={(e) => handleChangInput(e)}
                            />
                        </div>
                        <p>{err.address}</p>
                        <div className={cx('col-6', 'form-group', 'CCCD/CMND')}>
                            <input
                                name="avatar"
                                type="file"
                                placeholder="Nhập avatar"
                                onChange={(e) => handleChangInputFile(e)}
                                multiple
                            ></input>
                        </div>
                        <p>{err.files}</p>
                        <div className={cx('col-12', '')}>
                            <button className={cx('btn-register')} onClick={(e) => CheckInput(e)}>
                                Đăng Kí
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default RegisterTest;
