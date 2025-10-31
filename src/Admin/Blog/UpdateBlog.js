import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiAdmin from "../../API/apiAdmin";
import { toast } from "react-toastify";
import refershToken from "../../RefershToken/RefershToken";

function UpdateBlog() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  };
  let { id } = useParams();
  const [err, SetErr] = useState({});
  const [input, SetInput] = useState({
    title: "",
    description: "",
    content: "",
    avatar: "",
  });
  const [FileNew, SetFileNew] = useState([]);
  function onChangInput(e) {
    let name = e.target.name;
    let value = e.target.value;
    SetInput((states) => ({ ...states, [name]: value }));
  }
  function onChangInputFile(e) {
    let value = e.target.files;
    SetFileNew(value);
  }
  useEffect(() => {
    apiAdmin
      .get("/blog/" + id, config)
      .then((res) => {
        console.log(res.data.data);
        SetInput({
          title: res.data.data.title,
          description: res.data.data.description,
          content: res.data.data.content,
          avatar: res.data.data.image,
        });
      })
      .catch((error) => console.log(error));
  }, []);
  function checkInput(e) {
    e.preventDefault();
    let errAll = {};
    let check = true;
    let allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    let maxSize = 1024 * 1024;
    console.log(input);
    console.log(FileNew);
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
    if (FileNew.length <= 0) {
      errAll.avatar = "Vui lòng chọn file";
      check = false;
    } else {
      if (FileNew[0].size > maxSize) {
        errAll.avatar = "Vui lòng chọn file < 1mb";
        check = false;
      }
      if (!allowedTypes.includes(FileNew[0].type)) {
        errAll.avatar = "Vui lòng chọn đúng định dạng file";
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
      data.append("image", FileNew[0]);
      apiAdmin
        .put("/blog/" + id, data, config)
        .then((res) => {
          console.log(res);
          toast.success("Update Blog thành công");
          navigate("/dashboard/blog/list");
          SetErr({});
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
                const res2 = await apiAdmin.put("/blog/" + id, data, config);
                toast.success(res2.data.message + " (sau khi refresh token)");
                navigate("/dashboard/blog/list");
                SetErr({});
              } catch (refreshError) {
                toast.error("Lỗi khi làm mới token. Vui lòng đăng nhập lại.");
                console.error(refreshError);
              }
            } else if (status === 403) {
              toast.error(message);
            } else {
              toast.error("Lỗi khi update: " + message);
            }
          } else {
            toast.error("Không thể kết nối đến server: " + error.message);
          }
        });
    }
  }
  return (
    <div className="register">
      <h3>Edit Blog</h3>
      <form encType="multipart/form-data">
        <input
          name="title"
          type="text"
          placeholder="Nhập title"
          value={input.title}
          onChange={onChangInput}
        />
        <p>{err.title}</p>
        <input
          name="description"
          type="text"
          placeholder="Nhập description"
          value={input.description}
          onChange={onChangInput}
        ></input>
        <p>{err.description}</p>
        <textarea
          name="content"
          placeholder="Nhập content"
          value={input.content}
          onChange={onChangInput}
        ></textarea>
        <p>{err.content}</p>
        <input
          name="avatar"
          type="file"
          placeholder="Nhập avatar"
          onChange={onChangInputFile}
        ></input>
        <p>{err.avatar}</p>
        <img
          src={`http://localhost:3001/${input.avatar}`}
          className="img_blog"
        ></img>
        <button className="update-blog" onClick={(e) => checkInput(e)}>
          Update blog
        </button>
      </form>
    </div>
  );
}
export default UpdateBlog;
