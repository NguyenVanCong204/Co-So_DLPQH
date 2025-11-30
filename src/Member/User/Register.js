import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiMember from '../../API/apiMember';
import auth from '../../API/auth';
import './Register.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function RegisterMember() {
    const navigate = useNavigate();
    let [input, SetInput] = useState({
        email: '',
        name: '',
        pass: '',
        phone: '',
        address: '',
        country: '',
        level: 0,
        avatar: [],
    });
    let [country, SetCountry] = useState([]);
    let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
    };
    let [err, SetErr] = useState({});
    useEffect(() => {
        apiMember
            .get('/country')
            .then((res) => {
                SetCountry(res.data);
            })
            .catch((errors) => console.log(errors));
    }, []);
    function hanldeChangInput(e) {
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
        if (input.country == '') {
            errAll.country = 'Vui lòng nhập country';
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
            data.append('id_country', input.country);
            data.append('level', input.level);
            input.avatar.map((value, index) => {
                data.append('avatar', value);
            });
            auth.post('/register', data, config)
                .then((res) => {
                    SetErr({});
                    toast.success('Đăng kí tài khoản thành công');
                    console.log(res);
                    navigate('/');
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
                    }
                });
        }
    }
    return (
        <div className="register">
            <h2>ĐĂNG KÝ</h2>
            <form encType="multipart/form-data">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Nhập email"
                    onChange={(e) => hanldeChangInput(e)}
                />
                <p>{err.email}</p>

                <label htmlFor="name">Full Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nhập name"
                    onChange={(e) => hanldeChangInput(e)}
                ></input>
                <p>{err.name}</p>

                <label htmlFor="pass">Password</label>
                <input
                    id="pass"
                    name="pass"
                    type="password"
                    placeholder="Nhập password"
                    onChange={(e) => hanldeChangInput(e)}
                ></input>
                <p>{err.pass}</p>

                <label htmlFor="phone">Phone</label>
                <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="Nhập phone"
                    onChange={(e) => hanldeChangInput(e)}
                ></input>
                <p>{err.phone}</p>

                <label htmlFor="address">Address</label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Nhập address"
                    onChange={(e) => hanldeChangInput(e)}
                ></input>
                <p>{err.address}</p>

                <label htmlFor="country">Country</label>
                <select id="country" name="country" onChange={(e) => hanldeChangInput(e)}>
                    <option value="">---Chọn country---</option>
                    {country &&
                        country.map((value, index) => {
                            return (
                                <option key={index} value={value._id}>
                                    {value.name}
                                </option>
                            );
                        })}
                </select>
                <p>{err.country}</p>

                <label htmlFor="avatar">Avatar</label>
                <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    placeholder="Nhập avatar"
                    onChange={(e) => handleChangInputFile(e)}
                    multiple
                ></input>
                <p>{err.files}</p>

                <select>
                    <option value="0">Member</option>
                </select>

                <button className="register_member" onClick={(e) => CheckInput(e)}>
                    Đăng ký
                </button>

                <ul className="auth-links">
                    <li>Bạn đã có tài khoản?</li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/');
                            }}
                        >
                            Đăng nhập
                        </a>
                    </li>
                </ul>
            </form>
        </div>
    );
}
export default RegisterMember;
