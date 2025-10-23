import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../API/api";
import "./Register.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function RegisterMember() {
  const navigate = useNavigate();
  let [input, SetInput] = useState({
    email: "",
    name: "",
    pass: "",
    phone: "",
    address: "",
    country: "",
    level: 0,
    avatar: [],
  });
  let [country, SetCountry] = useState([]);
  let config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  };
  let [err, SetErr] = useState({});
  useEffect(() => {
    api
      .get("country/getall")
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
    let allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (input.email == "") {
      errAll.email = "Vui lòng nhập email";
      chek = false;
    } else {
      if (!emailRegex.test(input.email)) {
        errAll.email = "Email không hợp lệ";
        chek = false;
      }
    }
    if (input.name == "") {
      errAll.name = "Vui lòng nhập name";
      chek = false;
    }
    if (input.pass == "") {
      errAll.pass = "Vui lòng nhập pass";
      chek = false;
    }
    if (input.phone == "") {
      errAll.phone = "Vui lòng nhập phone";
      chek = false;
    } else {
      if (!phoneRegex.test(input.phone)) {
        errAll.phone = "Số điện thoại không hợp lệ";
        chek = false;
      }
    }
    if (input.address == "") {
      errAll.address = "Vui lòng nhập address";
      chek = false;
    }
    if (input.country == "") {
      errAll.country = "Vui lòng nhập country";
      chek = false;
    }
    if (input.avatar.length <= 0) {
      errAll.files = "Vui lòng chọn files";
      chek = false;
    }
    if (input.avatar.length > 3) {
      errAll.files = "Chỉ chọn được tối đa 3 files";
      chek = false;
    } else {
      input.avatar.map((value, index) => {
        console.log("File type:", value.type);
        if (value.size > 1024 * 1024) {
          errAll.files = "Vui lòng chọn ảnh nhỏ hơn 1mb";
          chek = false;
        }
        if (!allowedTypes.includes(value.type)) {
          errAll.files = "Vui lòng chọn đúng định dạng files";
          chek = false;
        }
      });
    }
    if (!chek) {
      SetErr(errAll);
    } else {
      let data = new FormData();
      data.append("name", input.name);
      data.append("email", input.email);
      data.append("password", input.pass);
      data.append("phone", input.phone);
      data.append("address", input.address);
      data.append("id_country", input.country);
      data.append("level", input.level);
      input.avatar.map((value, index) => {
        data.append("avatar", value);
      });
      api
        .post("member/user/create", data, config)
        .then((res) => {
          SetErr({});
          toast.success("Đăng kí tài khoản thành công");
          console.log(res);
          navigate("/");
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            errAll.api = error.response.data.errors;
            console.log(error.response.data.errors);
            Object.values(error.response.data.errors).map((value, index) => {
              toast.error(value);
            });
            SetErr(errAll);
          } else {
            console.error("Lỗi không xác định:", error);
          }
        });
    }
  }
  return (
    <div className="register">
      <h2>Register</h2>
      <form encType="multipart/form-data">
        <input
          name="email"
          type="text"
          placeholder="Nhập email"
          onChange={(e) => hanldeChangInput(e)}
        />
        <p>{err.email}</p>
        <input
          name="name"
          type="text"
          placeholder="Nhập name"
          onChange={(e) => hanldeChangInput(e)}
        ></input>
        <p>{err.name}</p>
        <input
          name="pass"
          type="password"
          placeholder="Nhập password"
          onChange={(e) => hanldeChangInput(e)}
        ></input>
        <p>{err.pass}</p>
        <input
          name="phone"
          type="text"
          placeholder="Nhập phone"
          onChange={(e) => hanldeChangInput(e)}
        ></input>
        <p>{err.phone}</p>
        <input
          name="address"
          type="text"
          placeholder="Nhập address"
          onChange={(e) => hanldeChangInput(e)}
        ></input>
        <p>{err.address}</p>
        <select name="country" onChange={(e) => hanldeChangInput(e)}>
          <option value="">---Chọn country---</option>
          {country &&
            country.map((value, index) => {
              return (
                <option key={index} value={value.id}>
                  {value.name}
                </option>
              );
            })}
        </select>
        <p>{err.country}</p>
        <input
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
          Register
        </button>
        <Link to="/">
          <button className="login_member"> Login </button>
        </Link>
      </form>
    </div>
  );
}
export default RegisterMember;
