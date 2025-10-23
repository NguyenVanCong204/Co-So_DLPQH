import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from "react";
import api from "../../API/api";
import refershToken from "../RefershToken/RefershToken";
import { Link } from "react-router-dom";
import("./ProductList.css");
function ProductList() {
  const token = localStorage.getItem("token");
  const idUser = localStorage.getItem("IdUser");
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [input, SetInput] = useState([]);
  function getListProduct() {
    api
      .get("member/user/product/list/" + idUser, config)
      .then((res) => {
        console.log(res.data);
        SetInput(res.data);
      })
      .catch(async (err) => {
        if (err && err.response && err.response.status == 401) {
          try {
            const tokenNew = await refershToken();
            if (tokenNew) {
              let config = {
                headers: {
                  Authorization: `Bearer ${tokenNew}`,
                },
              };
              api
                .get("member/user/product/list/" + idUser, config)
                .then((res) => {
                  console.log(res.data);
                })
                .catch((err) => {
                  if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.errors
                  ) {
                    console.log(err.response.data.errors);
                  } else {
                    alert("Lỗi khi lấy dữ kiệu product" + err.message);
                  }
                });
            } else {
              alert("Không thể làm mới token");
            }
          } catch (error) {
            alert("Lỗi khi làm mới token. Vui lòng đăng nhập lại.");
            console.error(error);
          }
        }
      });
  }
  useEffect(() => {
    getListProduct();
  }, []);
  function deleteProduct(id) {
    api
      .delete("member/user/product/delete/" + id, config)
      .then((res) => {
        console.log(res.data);
        alert("delete ok");
        getListProduct();
      })
      .catch(async (err) => {
        if (err && err.response && err.response.status == 401) {
          try {
            const tokenNew = await refershToken();
            if (tokenNew) {
              let config = {
                headers: {
                  Authorization: `Bearer ${tokenNew}`,
                },
              };
              api
                .delete("member/user/product/delete/" + idUser, config)
                .then((res) => {
                  console.log(res.data);
                  alert("delete ok");
                  getListProduct();
                })
                .catch((err) => {
                  if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.errors
                  ) {
                    console.log(err.response.data.errors);
                  } else {
                    alert("Lỗi khi lấy dữ kiệu product" + err.message);
                  }
                });
            } else {
              alert("Không thể làm mới token");
            }
          } catch (error) {
            alert("Lỗi khi làm mới token. Vui lòng đăng nhập lại.");
            console.error(error);
          }
        }
      });
  }
  function renderInput() {
    return input.map((value, index) => {
      const image = JSON.parse(value.image);
      return (
        <tr key={index}>
          <td>{value.id}</td>
          <td>{value.company}</td>
          <td>{value.detail}</td>
          <td>{value.name}</td>
          <td>
            <img src={`http://localhost:3001/${image[0]}`}></img>
          </td>
          <td>{value.sale} %</td>
          <td>{value.price} VND</td>
          <td className="active">
            <Link to={`/member/account/product/update/${value.id}`}>
              <i className="fa-solid fa-pen-to-square"></i>
            </Link>
            <i
              className="fa-solid fa-trash"
              onClick={() => deleteProduct(value.id)}
            ></i>
          </td>
        </tr>
      );
    });
  }
  return (
    <div className="product-list">
      <h2>List Product</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Company</th>
              <th>Detail</th>
              <th>Name</th>
              <th>Image</th>
              <th>Sale</th>
              <th>Price</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>{renderInput()}</tbody>
        </table>
      </div>
    </div>
  );
}
export default ProductList;
