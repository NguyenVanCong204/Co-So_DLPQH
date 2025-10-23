import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../API/api";
import { toast } from "react-toastify";

function UpdateBlog() {
  const navigate = useNavigate();
  let config = {
    headers: {
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
    api
      .get("blog/getblog/" + id)
      .then((res) => {
        SetInput({
          title: res.data.title,
          description: res.data.description,
          content: res.data.content,
          avatar: res.data.image,
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
      api
        .put("blog/update/" + id, data, config)
        .then((res) => {
          console.log(res);
          toast.success("Update Blog thành công");
          navigate("/admin/blog/list");
          SetErr({});
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
