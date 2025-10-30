import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from "react";
import apiMember from "../../API/apiMember";
import refershToken from "../../RefershToken/RefershToken";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmDialog } from "../../component/confirmDialog";
import("./ProductList.css");
function ProductList() {
  const token = localStorage.getItem("token");
  const idUser = localStorage.getItem("IdUser");
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  };
  const [input, SetInput] = useState([]);
  function getListProduct() {
    apiMember
      .get("user/product/" + idUser, config)
      .then((res) => {
        console.log(res.data);
        SetInput(res.data.data);
      })
      .catch(async (error) => {
        if (error.response) {
          const status = error.response.status;
          const message =
            error.response.data?.error ||
            error.response.data?.message ||
            error.message;
          if (status == 401) {
            try {
              const newtoken = await refershToken();
              if (!newtoken) {
                return toast.error(
                  "Không thể làm mới token. Vui lòng đăng nhập lại."
                );
              }
              let config = {
                headers: {
                  Authorization: `Bearer ${newtoken}`,
                  "Content-Type": "application/x-www-form-urlencoded",
                  Accept: "application/json",
                },
              };
              const res2 = await apiMember.get("/product/" + idUser, config);
              toast.success(res2.data.message + " (sau khi refresh token)");
              console.log(res2.data);
              SetInput(res2.data.data);
            } catch (refreshError) {
              toast.error("Lỗi khi làm mới token. Vui lòng đăng nhập lại.");
              console.error(refreshError);
            }
          } else if (status === 403) {
            toast.error(message);
          } else {
            toast.error("Lỗi khi delete: " + message);
          }
        } else {
          toast.error("Không thể kết nối đến server: " + error.message);
        }
      });
  }
  useEffect(() => {
    getListProduct();
  }, []);
  async function deleteProduct(id) {
    const result = await confirmDialog({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa product này không?",
    });
    if (!result.isConfirmed) return;
    apiMember
      .delete("/product/" + id, config)
      .then((res) => {
        console.log(res.data);
        toast.success(res.data.message);
        getListProduct();
      })
      .catch(async (error) => {
        if (error.response) {
          const status = error.response.status;
          const message =
            error.response.data?.error ||
            error.response.data?.message ||
            error.message;
          if (status == 401) {
            try {
              const newtoken = await refershToken();
              if (!newtoken) {
                return toast.error(
                  "Không thể làm mới token. Vui lòng đăng nhập lại."
                );
              }
              let config = {
                headers: {
                  Authorization: `Bearer ${newtoken}`,
                  "Content-Type": "application/x-www-form-urlencoded",
                  Accept: "application/json",
                },
              };
              const res2 = await apiMember.delete("/product/" + id, config);
              console.log(res2.data);
              toast.success(res2.data.message);
              getListProduct();
            } catch (refreshError) {
              toast.error("Lỗi khi làm mới token. Vui lòng đăng nhập lại.");
              console.error(refreshError);
            }
          } else if (status === 403) {
            toast.error(message);
          } else {
            toast.error("Lỗi khi delete: " + message);
          }
        } else {
          toast.error("Không thể kết nối đến server: " + error.message);
        }
      });
  }
  function renderInput() {
    return input.map((value, index) => {
      const image = JSON.parse(value.image);
      return (
        <tr key={index}>
          <td>{index}</td>
          <td>{value.name}</td>
          <td>{value.company}</td>
          <td>{value.detail}</td>
          <td>
            <img src={`http://localhost:3001/${image[0]}`}></img>
          </td>
          <td>{value.sale} %</td>
          <td>{value.price} VND</td>
          <td className="active">
            <Link to={`/member/account/product/update/${value._id}`}>
              <i className="fa-solid fa-pen-to-square"></i>
            </Link>
            <i
              className="fa-solid fa-trash"
              onClick={() => deleteProduct(value._id)}
            ></i>
          </td>
        </tr>
      );
    });
  }
  return (
    <div className="product-list">
      <h2>List Product</h2>
      <Link to="/member/account/product/add">
        <button className="add-product">Add Product</button>
      </Link>
      <div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Company</th>
              <th>Detail</th>
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
