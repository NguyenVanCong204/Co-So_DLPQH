import { useState } from "react";
import api from "../../API/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddBlog() {
  const navigate = useNavigate();
  const [err, SetErr] = useState({});
  let config = {
    headers: {
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
      api
        .post("blog/create", data, config)
        .then((res) => {
          console.log(res);
          SetErr({});
          toast.success("Add Blog thành công");
          navigate("/admin/blog/list");
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            errAll.api = error.response.data.errors;
            toast.error(error.response.data.errors);
            console.log(error.response.data.errors);
            SetErr(errAll);
          } else {
            console.error("Lỗi không xác định:", error);
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
