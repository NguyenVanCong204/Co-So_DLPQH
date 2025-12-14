import { useEffect, useState } from 'react';
import apiMember from '../../API/apiMember';
import { useParams } from 'react-router-dom';
import refershToken from '../../RefershToken/RefershToken';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ProductUpdate() {
    const navigate = useNavigate();
    const [err, SetErr] = useState({});
    const [category, Setcategory] = useState([]);
    const [brand, Setbrand] = useState([]);
    const [avatarDelete, SetAvatarDelete] = useState([]);
    const [avatarNew, SetAvatarNew] = useState([]);
    const token = localStorage.getItem('token');
    const { id } = useParams();
    const idUser = localStorage.getItem('IdUser');
    const [input, SetInput] = useState({
        name: '',
        price: '',
        category: '',
        brand: '',
        status: '',
        sale: '0',
        company: '',
        detail: '',
        quantity: '',
        avatar: [],
    });
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
    };
    function getData() {
        apiMember
            .get('/product/' + id, config)
            .then((res) => {
                console.log(res.data.data);
                SetInput({
                    name: res.data.data.name,
                    price: res.data.data.price,
                    category: res.data.data.id_category,
                    brand: res.data.data.id_brand,
                    status: res.data.data.status,
                    sale: res.data.data.sale,
                    company: res.data.data.company,
                    quantity: res.data.data.quantity || res.data.data.quality,
                    detail: res.data.data.detail,
                    avatar: JSON.parse(res?.data?.data?.image),
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        apiMember
            .get('/brand')
            .then((res) => {
                Setbrand(res.data.data);
            })
            .catch((error) => console.log(error));
        apiMember
            .get('/category')
            .then((res) => {
                Setcategory(res.data.data);
            })
            .catch((error) => console.log(error));

        getData();
    }, []);
    function handleChangInput(e) {
        const value = e.target.value;
        const name = e.target.name;
        SetInput((states) => ({ ...states, [name]: value }));
    }
    function handleChangInputAvatar(e) {
        const value = Array.from(e.target.files);
        SetAvatarNew(value);
    }
    function handleClickCheck(e) {
        e.preventDefault();
        let check = true;
        let errAll = {};

        if (input.name === '') {
            errAll.name = 'Vui lòng nhập name';
            check = false;
        }
        if (input.price === '') {
            errAll.price = 'Vui lòng chọn price';
            check = false;
        }
        if (input.category === '') {
            errAll.category = 'Vui lòng chọn category';
            check = false;
        }
        if (input.brand === '') {
            errAll.brand = 'Vui lòng nhập brand';
            check = false;
        }
        if (input.quantity === '') {
            errAll.quantity = 'Vui lòng nhập quantity';
            check = false;
        }
        if (input.status === '') {
            errAll.status = 'Vui lòng chọn status';
            check = false;
        }
        if (input.company === '') {
            errAll.company = 'Vui lòng nhập company';
            check = false;
        }
        if (input.detail === '') {
            errAll.detail = 'Vui lòng nhập detail';
            check = false;
        }
        if (input.avatar.length - avatarDelete.length + avatarNew.length > 3) {
            errAll.avatar = 'Tổng file thêm và xóa phải <=3';
            check = false;
        }
        if (avatarNew.length > 3) {
            errAll.avatar = 'Chỉ được chọn tối đa 3 file';
            check = false;
        } else {
            let allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            let maxSize = 1024 * 1024;
            avatarNew.map((value, index) => {
                if (value.size > maxSize) {
                    errAll.avatar = 'Chỉ được chọn size dưới 1mb';
                    check = false;
                }
                if (!allowedTypes.includes(value.type)) {
                    errAll.avatar = 'Vui lòng chọn đúng định dạng file ảnh';
                    check = false;
                }
            });
        }
        if (!check) {
            SetErr(errAll);
        } else {
            const data = new FormData();
            data.append('id_user', idUser);
            data.append('id_category', input.category);
            data.append('id_brand', input.brand);
            data.append('name', input.name);
            data.append('price', input.price);
            data.append('status', input.status);

            if (input.status == '1') {
                data.append('sale', 0);
            } else {
                data.append('sale', input.sale);
            }
            data.append('detail', input.detail);
            data.append('company', input.company);
            data.append('quantity', input.quantity);
            avatarDelete.map((value, index) => {
                data.append('imageDelete', value);
            });
            avatarNew.map((value, index) => {
                data.append('image', value);
            });
            apiMember
                .put('/product/' + id, data, config)
                .then((res) => {
                    console.log(res.data.message);
                    SetAvatarDelete([]);
                    SetErr({});
                    getData();
                    toast.success(res.data.message);
                    navigate('/member/account/product/list');
                })
                .catch(async (error) => {
                    if (error.response) {
                        const status = error.response.status;
                        const message =
                            error.response.data?.error ||
                            error.response.data?.errors ||
                            error.response.data?.message ||
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
                                const res2 = await apiMember.put('/product/' + id, data, config);
                                console.log(res2.data.message);
                                SetAvatarDelete([]);
                                SetErr({});
                                getData();
                                toast.success(res2.data.message);
                                navigate('/member/account/product/list');
                            } catch (refreshError) {
                                toast.error('Lỗi khi làm mới token. Vui lòng đăng nhập lại.');
                                console.error(refreshError);
                            }
                        } else if (status === 403) {
                            toast.error(message);
                        } else {
                            if (typeof message === 'object' && message !== null) {
                                const keys = Object.keys(message);
                                if (keys.length > 0) {
                                    const firstKey = keys[0];
                                    toast.error('Lỗi khi sửa: ' + message[firstKey]);
                                }
                            } else {
                                toast.error('Lỗi khi sửa: ' + message);
                            }
                        }
                    } else {
                        toast.error('Không thể kết nối đến server: ' + error.message);
                    }
                });
        }
    }
    function checkAvatarDelete(e) {
        if (e.target.checked) {
            SetAvatarDelete((states) => [...states, e.target.value]);
        } else {
            SetAvatarDelete(avatarDelete.filter((f) => f !== e.target.value));
        }
    }
    function renderAvatar() {
        return input.avatar.map((value, index) => {
            return (
                <div key={index} className="avatar">
                    <img src={`http://localhost:3001/${value}`}></img>
                    <input
                        type="checkbox"
                        value={value}
                        checked={avatarDelete.includes(value)}
                        onChange={checkAvatarDelete}
                    ></input>
                </div>
            );
        });
    }
    return (
        <div className="product-add">
            <h2>Update Product</h2>
            <form encType="multipart/form-data">
                <input
                    placeholder="Name"
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={handleChangInput}
                ></input>
                <p>{err.name}</p>
                <input
                    placeholder="Price"
                    type="text"
                    name="price"
                    value={input.price}
                    onChange={handleChangInput}
                ></input>
                <p>{err.price}</p>
                <select name="category" value={input.category} onChange={handleChangInput}>
                    <option value="">---Chọn category---</option>
                    {category.map((value, index) => {
                        return (
                            <option key={index} value={value._id}>
                                {value.name}
                            </option>
                        );
                    })}
                </select>
                <p>{err.category}</p>
                <select name="brand" value={input.brand} onChange={handleChangInput}>
                    <option value="">---Chọn brand---</option>
                    {brand.map((value, index) => {
                        return (
                            <option key={index} value={value._id}>
                                {value.name}
                            </option>
                        );
                    })}
                </select>
                <p>{err.brand}</p>
                <select name="status" value={input.status} onChange={handleChangInput}>
                    <option value="">---Chọn trạng thái---</option>
                    <option value="1">Sale</option>
                    <option value="0">New</option>
                </select>
                <p>{err.status}</p>
                {input.status == '0' ? (
                    <div className="sale1">
                        <input value={input.sale} name="sale" type="text" onChange={handleChangInput}></input>
                        <p>%</p>
                    </div>
                ) : (
                    ''
                )}

                <input
                    placeholder="Company"
                    type="text"
                    name="company"
                    value={input.company}
                    onChange={handleChangInput}
                ></input>
                <p>{err.company}</p>
                <input
                    placeholder="Quantity"
                    type="text"
                    name="quantity"
                    value={input.quantity}
                    onChange={handleChangInput}
                ></input>
                <p>{err.company}</p>
                <input type="file" multiple name="avatar" onChange={handleChangInputAvatar}></input>
                <p>{err.avatar}</p>
                <div className="List-avatar">{renderAvatar()}</div>
                <input
                    placeholder="Detail"
                    name="detail"
                    type="text"
                    value={input.detail}
                    onChange={handleChangInput}
                ></input>
                <p>{err.detail}</p>
                <button onClick={(e) => handleClickCheck(e)}>Update Product</button>
            </form>
        </div>
    );
}
export default ProductUpdate;
