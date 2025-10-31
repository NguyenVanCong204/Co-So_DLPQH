import { useEffect, useState } from "react";
import "./ListBlog.css";
import apiAdmin from "../../API/apiAdmin";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useNavigate } from "react-router-dom";
import { confirmDialog } from "../../component/confirmDialog";
import { toast } from "react-toastify";
import refershTokenAdmin from "../../RefershToken/RefershToken";

function ListBlog() {
  const token = localStorage.getItem("token");
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  };
  const navigate = useNavigate();
  const [input, SetInput] = useState([]);
  function getData() {
    apiAdmin
      .get("/blog", config)
      .then((res) => {
        console.log(res.data.data);
        SetInput(res.data.data);
      })
      .catch((error) => console.log(error));
  }
  useEffect(() => {
    getData();
  }, []);
  function editBlog(id) {
    navigate("/dashboard/blog/update/" + id);
  }
  async function deleteBlog(id) {
    const result = await confirmDialog({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa blog này không?",
    });
    if (!result.isConfirmed) return;
    apiAdmin
      .delete("/blog/" + id, config)
      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
        getData();
      })
      .catch(async (error) => {
        if (error.response) {
          const status = error.response.status;
          const message =
            error.response.data?.error ||
            error.response.data?.message ||
            error.message;

          // Trường hợp token hết hạn
          if (status == 401) {
            try {
              const newtoken = await refershTokenAdmin();
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

              // Gọi lại API sau khi refresh token
              const res2 = await apiAdmin.post("blog/delete/" + id, config);
              toast.success(res2.data.message + " (sau khi refresh token)");
              getData();
            } catch (refreshError) {
              toast.error("Lỗi khi làm mới token. Vui lòng đăng nhập lại.");
              console.error(refreshError);
            }
          }
          // Trường hợp không có quyền
          else if (status === 403) {
            toast.error(message);
          }
          // Các lỗi khác
          else {
            toast.error("Lỗi khi delete: " + message);
          }
        } else {
          // Nếu không có phản hồi từ server (mất kết nối, v.v.)
          toast.error("Không thể kết nối đến server: " + error.message);
        }
      });
  }
  function renderBlog() {
    return input.map((value, index) => {
      return (
        <tr key={index}>
          <td>{index}</td>
          <td>{value.title}</td>
          <td>
            <img src={`http://localhost:3001/${value.image}`}></img>
          </td>
          <td>{value.description}</td>
          <td>{value.title}</td>
          <td className="action_admin_blog">
            <div className="action1">
              <button>
                <i
                  className="fa-solid fa-pen-to-square"
                  onClick={() => editBlog(value._id)}
                ></i>
              </button>
              <button>
                <i
                  className="fa-solid fa-trash"
                  onClick={() => deleteBlog(value._id)}
                ></i>
              </button>
            </div>
          </td>
        </tr>
      );
    });
  }
  return (
    <div className="Blog_list">
      <div className="Blog_table">
        <h2>Danh sách Blog</h2>
        <Link to="/dashboard/blog/add">
          <button className="add-blog">Add Blog</button>
        </Link>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Image</th>
              <th>Description</th>
              <th>Content</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>{renderBlog()}</tbody>
        </table>
      </div>
    </div>
  );
}
export default ListBlog;
