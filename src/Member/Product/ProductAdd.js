import { useEffect, useState } from "react";
import "./ProductAdd.css";
import apiMember from "../../API/apiMember";
import refershToken from "../../RefershToken/RefershToken";
function ProductAdd() {
  const [err, SetErr] = useState({});
  const [category, Setcategory] = useState([]);
  const [brand, Setbrand] = useState([]);
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
  const token = localStorage.getItem("token");
  const idUser = localStorage.getItem("IdUser");
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  };
  useEffect(() => {
    apiMember
      .get("member/user/brand")
      .then((res) => {
        Setbrand(res.data);
      })
      .catch((error) => console.log(error));
    apiMember
      .get("member/user/category")
      .then((res) => {
        Setcategory(res.data);
      })
      .catch((error) => console.log(error));
  }, []);
  function handleChangInput(e) {
    const value = e.target.value;
    const name = e.target.name;
    SetInput((states) => ({ ...states, [name]: value }));
  }
  function handleChangInputAvatar(e) {
    const value = Array.from(e.target.files);
    const name = e.target.name;
    SetInput((status) => ({ ...status, [name]: value }));
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
    if (input.avatar.length <= 0) {
      errAll.avatar = "Vui lòng chọn file";
      check = false;
    }
    if (input.avatar.length > 3) {
      errAll.avatar = "Chỉ được chọn tối đa 3 file";
      check = false;
    } else {
      let allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      let maxSize = 1024 * 1024;
      input.avatar.map((value, index) => {
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
      data.append("id_user", idUser);
      data.append("name", input.name);
      data.append("price", input.price);
      data.append("status", input.status);
      data.append("sale", input.sale);
      data.append("detail", input.detail);
      data.append("company", input.company);
      input.avatar.map((value, index) => {
        data.append("image", value);
      });
      apiMember
        .post("member/user/product/add", data, config)
        .then((res) => {
          alert("Thành công");
          console.log(res);
          SetErr({});
        })
        .catch(async (err) => {
          if (err && err.response.status == 401) {
            try {
              const newtoken = await refershToken();
              if (newtoken) {
                let config = {
                  headers: {
                    Authorization: `Bearer ${newtoken}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json",
                  },
                };
                apiMember
                  .post("member/user/product/add", data, config)
                  .then((res) => {
                    alert("Add product thành công sau khi referesh token");
                    console.log(res);
                    SetErr({});
                  })
                  .catch(async (err) => {
                    if (
                      err &&
                      err.response &&
                      err.response.data &&
                      err.response.data.errors
                    ) {
                      console.log(err.response.data.errors);
                    } else {
                      alert("Lỗi khi add product" + err.message);
                    }
                  });
              } else {
                alert("Không thể làm mới token");
              }
            } catch (error) {
              alert("Lỗi khi làm mới token. Vui lòng đăng nhập lại.");
              console.error(error);
            }
          } else {
            if (
              err &&
              err.response &&
              err.response.data &&
              err.response.data.errors
            ) {
              console.log(err.response.data.errors);
            } else {
              alert("Lỗi khi add product" + err.message);
            }
          }
        });
    }
  }
  return (
    <div className="product-add">
      <h2>Create Product</h2>
      <form encType="multipart/form-data">
        <input
          placeholder="Name"
          type="text"
          name="name"
          onChange={handleChangInput}
        ></input>
        <p>{err.name}</p>
        <input
          placeholder="Price"
          type="text"
          name="price"
          onChange={handleChangInput}
        ></input>
        <p>{err.price}</p>
        <select name="category" onChange={handleChangInput}>
          <option value="">---Chọn category---</option>
          {category.map((value, index) => {
            return <option value={value.id}>{value.name}</option>;
          })}
        </select>
        <p>{err.category}</p>
        <select name="brand" onChange={handleChangInput}>
          <option value="">---Chọn brand---</option>
          {brand.map((value, index) => {
            return <option value={value.id}>{value.name}</option>;
          })}
        </select>
        <p>{err.brand}</p>
        <select name="status" onChange={handleChangInput}>
          <option value="">---Chọn trạng thái---</option>
          <option value="1">Sale</option>
          <option value="0">New</option>
        </select>
        <p>{err.status}</p>
        {input.status === "0" ? (
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
        <input
          placeholder="Detail"
          name="detail"
          type="text"
          onChange={handleChangInput}
        ></input>
        <p>{err.detail}</p>
        <button onClick={(e) => handleClickCheck(e)}>Add Product</button>
      </form>
    </div>
  );
}
export default ProductAdd;
