import { useEffect, useState } from 'react';
import apiMember from '../../API/apiMember';
import { toast } from 'react-toastify';
import refershToken from '../../RefershToken/RefershToken';
import './Update.css';
import Breadcrumb from '../../component/Member/Breadcrumb';
function UpdateMember() {
    let [input, SetInput] = useState({
        email: '',
        name: '',
        pass: '',
        phone: '',
        address: '',
        country: '',
        avatar: [],
    });
    let iduser = localStorage.getItem('IdUser');
    let token = localStorage.getItem('token');
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
    };
    let [country, SetCountry] = useState([]);

    let [FileNew, SetFileNew] = useState([]);
    let [err, SetErr] = useState({});
    useEffect(() => {
        apiMember
            .get('/country')
            .then((res) => {
                SetCountry(res.data);
            })
            .catch((errors) => console.log(errors));
        getDataUser();
    }, []);
    function getDataUser() {
        apiMember.get('/user/' + iduser, config).then((res) => {
            console.log(res.data);
            SetInput({
                email: res.data.email,
                name: res.data.name,
                pass: '',
                phone: res.data.phone,
                address: res.data.address,
                country: res.data.id_country,
                avatar: JSON.parse(res.data.avatar),
            });
        });
    }
    function changInput(e) {
        const name = e.target.name;
        const value = e.target.value;
        SetInput((states) => ({ ...states, [name]: value }));
    }
    function changInputFile(e) {
        const value = Array.from(e.target.files);
        SetFileNew(value);
    }

    function renderImage() {
        return input.avatar.map((value, index) => {
            return (
                <div key={index} className="avatar_list">
                    <img src={`http://localhost:3001/${value}`}></img>
                </div>
            );
        });
    }
    function checkInput(e) {
        e.preventDefault();
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        let allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        let errAll = {};
        let check = true;
        if (input.name == '') {
            errAll.name = 'Vui lòng nhập name';
            check = false;
        }
        if (input.pass == '') {
            errAll.pass = 'Vui lòng nhập password';
            check = false;
        }
        if (input.phone == '') {
            errAll.phone = 'Vui lòng nhập phone';
            check = false;
        } else {
            if (!phoneRegex.test(input.phone)) {
                errAll.phone = 'Vui lòng nhập phone đúng định dạng';
                check = false;
            }
        }
        if (input.address == '') {
            errAll.address = 'Vui lòng nhập address';
            check = false;
        }
        if (input.country == '') {
            errAll.country = 'Vui lòng chọn country';
            check = false;
        }
        if (FileNew.length <= 0) {
            errAll.file = 'Vui lòng chọn file';
            check = false;
        }
        if (FileNew.length > 3) {
            errAll.file = 'Upload tối đa 3 file';
            check = false;
        } else {
            FileNew.map((value, index) => {
                if (value.size > 1024 * 1024) {
                    errAll.file = 'Chọn file có size < 1mb';
                    check = false;
                }
                if (!allowedTypes.includes(value.type)) {
                    errAll.file = 'Chọn đúng định dạng file';
                    check = false;
                }
            });
        }
        if (!check) {
            SetErr(errAll);
        } else {
            let data = new FormData();
            data.append('name', input.name);
            data.append('password', input.pass);
            data.append('phone', input.phone);
            data.append('address', input.address);
            data.append('id_country', input.country);
            FileNew.map((value, index) => {
                data.append('avatar', value);
            });
            apiMember
                .put('/user/' + iduser, data, config)
                .then((res) => {
                    SetErr({});
                    console.log(res);
                    toast.success('Update thành công');

                    const updatedUser = {
                        ...JSON.parse(localStorage.getItem('user')),
                        name: input.name,
                        phone: input.phone,
                        address: input.address,
                        avatar: res.data.data.avatar,
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));

                    window.dispatchEvent(new Event('user-updated'));

                    getDataUser();
                })
                .catch(async (error) => {
                    if (error.response) {
                        const status = error.response.status;
                        const message =
                            error.response.data?.error ||
                            error.response.data?.message ||
                            error.response.data?.error.id_country ||
                            error.message;
                        if (status == 401) {
                            try {
                                const newtoken = await refershToken();
                                if (!newtoken) {
                                    return toast.error('Không thể làm mới token. Vui lòng đăng nhập lại.');
                                }
                                let config = {
                                    headers: {
                                        Authorization: `Bearer ${newtoken}`,
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        Accept: 'application/json',
                                    },
                                };
                                const res2 = await apiMember.put('/user/' + iduser, data, config);
                                toast.success(res2.data.message + ' (sau khi refresh token)');
                                SetErr({});
                                console.log(res2);
                                getDataUser();
                            } catch (refreshError) {
                                toast.error('Lỗi khi làm mới token. Vui lòng đăng nhập lại.');
                                console.error(refreshError);
                            }
                        } else if (status === 403) {
                            toast.error(
                                'Bạn đang đăng nhập với quyền Admin. Vui lòng đăng nhập lại với tài khoản Member để cập nhật thông tin.',
                            );
                        } else {
                            if (typeof message === 'object' && message !== null) {
                                const keys = Object.keys(message);
                                if (keys.length > 0) {
                                    const firstKey = keys[0];
                                    toast.error('Lỗi khi thêm: ' + message[firstKey]);
                                }
                            } else {
                                toast.error('Lỗi khi thêm: ' + message);
                            }
                        }
                    } else {
                        toast.error('Không thể kết nối đến server: ' + error.message);
                    }
                });
        }
    }
    return (
        <div>
            <Breadcrumb items={[{ label: 'Tài Khoản', path: '/member/account/update' }, { label: 'Cập nhật thông tin' }]} />
            <div className="register">
                <h3>Cập Nhật Thông Tin</h3>
                <form encType="multipart/form-data">
                    <label>Email</label>
                    <input name="email" type="text" readOnly value={input.email} />
                    <p></p>

                    <label>Full Name</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Nhập name"
                        value={input.name}
                        onChange={changInput}
                    ></input>
                    <p>{err.name}</p>

                    <label>Password</label>
                    <input
                        name="pass"
                        type="password"
                        placeholder="Nhập password"
                        onChange={changInput}
                        value={input.pass}
                    ></input>
                    <p>{err.pass}</p>

                    <label>Phone Number</label>
                    <input
                        name="phone"
                        type="text"
                        placeholder="Nhập phone"
                        onChange={changInput}
                        value={input.phone}
                    ></input>
                    <p>{err.phone}</p>

                    <label>Address</label>
                    <input
                        name="address"
                        type="text"
                        placeholder="Nhập address"
                        onChange={changInput}
                        value={input.address}
                    ></input>
                    <p>{err.address}</p>

                    <label>Country</label>
                    <select name="country" value={input.country} onChange={changInput}>
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

                    <label>Avatar</label>
                    <input
                        name="avatar"
                        type="file"
                        placeholder="Nhập avatar"
                        multiple
                        onChange={changInputFile}
                    ></input>
                    <p>{err.file}</p>
                    <div className="avatar">{renderImage()}</div>
                    <button onClick={(e) => checkInput(e)}>Cập nhật thông tin</button>
                </form>
            </div>
        </div>
    );
}
export default UpdateMember;
