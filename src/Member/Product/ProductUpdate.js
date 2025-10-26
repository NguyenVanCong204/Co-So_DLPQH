import { useEffect, useState } from "react";
import api from "../../API/api";
import { useParams } from "react-router-dom";
import refershToken from "../../RefershToken/RefershToken";
import { toast } from "react-toastify";

function ProductUpdate() {
  const [err, SetErr] = useState({});
  const [category, Setcategory] = useState([]);
  const [brand, Setbrand] = useState([]);
  const [avatarDelete, SetAvatarDelete] = useState([]);
  const [avatarNew, SetAvatarNew] = useState([]);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [input, SetInput] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    status: "",
    sale: "0",
    company: "",
    detail: "",
    avatar: [],
  });
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  };
  function getData() {
    api
      .get("member/user/product/getproduct/" + id)
      .then((res) => {
        SetInput({
          name: res.data.name,
          price: res.data.price,
          category: res.data.id_category,
          brand: res.data.id_brand,
          status: res.data.status,
          sale: res.data.sale,
          company: res.data.company,
          detail: res.data.detail,
          avatar: JSON.parse(res?.data?.image),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    api
      .get("member/user/brand")
      .then((res) => {
        Setbrand(res.data);
      })
      .catch((error) => console.log(error));
    api
      .get("member/user/category")
      .then((res) => {
        Setcategory(res.data);
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

    if (input.name === "") {
      errAll.name = "Vui lòng nhập name";
      check = false;
    }
    if (input.price === "") {
      errAll.price = "Vui lòng chọn price";
      check = false;
    }
    if (input.category === "") {
      errAll.category = "Vui lòng chọn category";
      check = false;
    }
    if (input.brand === "") {
      errAll.brand = "Vui lòng nhập brand";
      check = false;
    }
    if (input.status === "") {
      errAll.status = "Vui lòng chọn status";
      check = false;
    }
    if (input.company === "") {
      errAll.company = "Vui lòng nhập company";
      check = false;
    }
    if (input.detail === "") {
      errAll.detail = "Vui lòng nhập detail";
      check = false;
    }
    if (input.avatar.length - avatarDelete.length + avatarNew.length > 3) {
      errAll.avatar = "Tổng file thêm và xóa phải <=3";
      check = false;
    }
    if (avatarNew.length > 3) {
      errAll.avatar = "Chỉ được chọn tối đa 3 file";
      check = false;
    } else {
      let allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      let maxSize = 1024 * 1024;
      avatarNew.map((value, index) => {
        if (value.size > maxSize) {
          errAll.avatar = "Chỉ được chọn size dưới 1mb";
          check = false;
        }
        if (!allowedTypes.includes(value.type)) {
          errAll.avatar = "Vui lòng chọn đúng định dạng file ảnh";
          check = false;
        }
      });
    }
    if (!check) {
      SetErr(errAll);
    } else {
      const data = new FormData();
      data.append("id_category", input.category);
      data.append("id_brand", input.brand);
      data.append("name", input.name);
      data.append("price", input.price);
      data.append("status", input.status);

      if (input.status == "1") {
        data.append("sale", 0);
      } else {
        data.append("sale", input.sale);
      }
      data.append("detail", input.detail);
      data.append("company", input.company);
      avatarDelete.map((value, index) => {
        data.append("imageDelete", value);
      });
      avatarNew.map((value, index) => {
        data.append("image", value);
      });
      api
        .put("member/user/product/update/" + id, data, config)
        .then((res) => {
          console.log(res);
          SetAvatarDelete([]);
          SetErr({});
          getData();
          toast.success("Update sản phẩm thành công");
        })
        .catch(async (error) => {
          if (error && error.response && error.response.status == 401) {
            const tokenNew = await refershToken();
            try {
              let config = {
                headers: {
                  Authorization: `Bearer ${tokenNew}`,
                  "Content-Type": "application/x-www-form-urlencoded",
                  Accept: "application/json",
                },
              };
              api
                .put("member/user/product/update/" + id, data, config)
                .then((res) => {
                  console.log(res);
                  SetErr({});
                  getData();
                  SetAvatarDelete([]);
                  toast.success(
                    "Update sản phẩm thành công sau khi lấy token mới"
                  );
                })
                .catch((error) => {
                  if (
                    error &&
                    error.response &&
                    error.response.data &&
                    error.response.data.error
                  ) {
                    console.log(
                      error.response.data && error.response.data.error
                    );
                  } else {
                    alert("Lỗi khi update product" + err.message);
                    toast.error("Lỗi khi update product sản phẩm");
                  }
                });
            } catch (error) {
              toast.error("Lỗi khi làm mới token. Vui lòng đăng nhập lại.");
              console.error(error);
            }
          } else {
            if (
              error &&
              error.response &&
              error.response.data &&
              error.response.data.errors
            ) {
              console.log(error.response.data.errors);
            }
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
        <select
          name="category"
          value={input.category}
          onChange={handleChangInput}
        >
          <option value="">---Chọn category---</option>
          {category.map((value, index) => {
            return (
              <option key={index} value={value.id}>
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
              <option key={index} value={value.id}>
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
        {input.status == "0" ? (
          <div className="sale1">
            <input
              value={input.sale}
              name="sale"
              type="text"
              onChange={handleChangInput}
            ></input>
            <p>%</p>
          </div>
        ) : (
          ""
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
          type="file"
          multiple
          name="avatar"
          onChange={handleChangInputAvatar}
        ></input>
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
