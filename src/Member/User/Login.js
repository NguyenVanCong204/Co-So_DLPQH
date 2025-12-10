import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiMember from '../../API/apiMember';
import auth from '../../API/auth';
import './Login.css';
import { toast } from 'react-toastify';

function LoginMember() {
    const navigate = useNavigate();
    let [err, SetErr] = useState({});
    const [input, SetInput] = useState({
        email: '',
        password: '',
        level: '0',
    });

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenReferesh');
        localStorage.removeItem('user');
        localStorage.removeItem('IdUser');

        window.dispatchEvent(new Event('user-updated'));
    }, []);

    function handleChangInput(e) {
        let name = e.target.name;
        let value = e.target.value;
        SetInput((states) => ({ ...states, [name]: value }));
    }
    function checkInput(e) {
        e.preventDefault();
        let errAll = {};
        let check = true;
        if (input.email == '') {
            errAll.email = 'Vui lòng nhập email';
            check = false;
        }
        if (input.password == '') {
            errAll.password = 'Vui lòng nhập password';
            check = false;
        }
        if (input.level == '') {
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
            auth.post('/login', data)
                .then((res) => {
                    console.log(res.data.user);
                    SetErr({});
                    localStorage.setItem('IdUser', res.data.user._id);
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('tokenReferesh', res.data.tokenReferesh);
                    localStorage.setItem('user', JSON.stringify(res.data.user));

                    window.dispatchEvent(new Event('user-updated'));

                    toast.success('Đăng nhập thành công');
                    navigate('/member/home');
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.message) {
                        console.log(error.response.data.message);
                        errAll.api = error.response.data.message;
                        SetErr(errAll);
                        toast.error(error.response.data.message);
                    } else {
                        console.error('Lỗi không xác định:', error);
                    }
                });
        }
    }
    function handleRegister(e) {
        e.preventDefault();
        navigate('/member/register');
    }
    return (
        <div className="login">
            <h2>ĐĂNG NHẬP</h2>
            <form>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Nhập email"
                    onChange={(e) => handleChangInput(e)}
                ></input>
                <p>{err.email}</p>

                <label htmlFor="password">Mật khẩu</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    onChange={(e) => handleChangInput(e)}
                ></input>
                <p>{err.password}</p>

                <label htmlFor="level" style={{ display: 'none' }}>
                    Level
                </label>
                <select id="level" name="level" value={input.level} onChange={(e) => handleChangInput(e)}>
                    <option value="0">Member</option>
                </select>
                <p>{err.level}</p>

                <button className="login_member" onClick={(e) => checkInput(e)}>
                    ĐĂNG NHẬP
                </button>

                <ul className="auth-links">
                    <li>Bạn chưa có tài khoản?</li>
                    <li>
                        <a href="#" onClick={(e) => handleRegister(e)}>
                            Đăng ký
                        </a>
                    </li>
                </ul>
            </form>
        </div>
    );
}
export default LoginMember;
