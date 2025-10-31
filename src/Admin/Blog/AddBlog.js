import { useState } from "react";
import apiAdmin from "../../API/apiAdmin";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import refershToken from "../../RefershToken/RefershToken";

function AddBlog() {
  const navigate = useNavigate();
  const [err, SetErr] = useState({});
  const token = localStorage.getItem("token");
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  };
  const [input, SetInput] = useState({
    title: "",
    description: "",
    content: "",
    avatar: [],
  });
  function handleChangInput(e) {
    let name = e.target.name;
    let value = e.target.value;
    SetInput((states) => ({ ...states, [name]: value }));
  }
  function handleChangInputFile(e) {
    let name = e.target.name;
    let value = e.target.files;
    SetInput((states) => ({ ...states, [name]: value }));
  }
  function hanldeCheckInput(e) {
    e.preventDefault();
    let errAll = {};
    let check = true;
    let allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    let maxSize = 1024 * 1024;
    if (input.title == "") {
      errAll.title = "Vui lòng nhập title";
      check = false;
    }
    if (input.description == "") {
      errAll.description = "Vui lòng nhập description";
      check = false;
    }
    if (input.content == "") {
      errAll.content = "Vui lòng nhập content";
      check = false;
    }
    if (input.avatar.length <= 0) {
      errAll.avatar = "Vui lòng chọn avatar";
      check = false;
    } else {
      if (input.avatar[0].size > maxSize) {
        errAll.avatar = "Vui lòng chọn file < 1mb";
        check = false;
      }
      if (!allowedTypes.includes(input.avatar[0].type)) {
        errAll.avatar = "Vui lòng chọn đúng định dạng file ảnh";
        check = false;
      }
    }

    if (!check) {
      SetErr(errAll);
    } else {
      let data = new FormData();
      data.append("title", input.title);
      data.append("description", input.description);
      data.append("content", input.content);
      data.append("image", input.avatar[0]);
      apiAdmin
        .post("/blog", data, config)
        .then((res) => {
          console.log(res);
          SetErr({});
          toast.success("Add Blog thành công");
          navigate("/dashboard/blog/list");
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
                const res2 = await apiAdmin.post("/blog", data, config);
                toast.success(res2.data.message + " (sau khi refresh token)");
                navigate("/dashboard/blog/list");
              } catch (refreshError) {
                toast.error("Lỗi khi làm mới token. Vui lòng đăng nhập lại.");
                console.error(refreshError);
              }
            } else if (status === 403) {
              toast.error(message);
            } else {
              toast.error("Lỗi khi thêm: " + message);
            }
          } else {
            toast.error("Không thể kết nối đến server: " + error.message);
          }
        });
    }
  }
  return (
    <div className="register">
      <h3>Add Blog</h3>
      <form encType="multipart/form-data">
        <input
          name="title"
          type="text"
          placeholder="Nhập title"
          onChange={handleChangInput}
        />
        <p>{err.title}</p>
        <input
          name="description"
          type="text"
          placeholder="Nhập description"
          onChange={handleChangInput}
        ></input>
        <p>{err.description}</p>
        <textarea
          name="content"
          placeholder="Nhập content"
          onChange={handleChangInput}
        ></textarea>
        <p>{err.content}</p>
        <input
          name="avatar"
          type="file"
          placeholder="Nhập avatar"
          onChange={handleChangInputFile}
        ></input>
        <p>{err.avatar}</p>
        <button className="add-blog" onClick={(e) => hanldeCheckInput(e)}>
          Add blog
        </button>
      </form>
    </div>
  );
}
export default AddBlog;
