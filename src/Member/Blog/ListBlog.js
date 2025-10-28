import { useEffect, useState } from "react";
import "./ListBlog.css";
import apiMember from "../../API/apiMember";
import { useNavigate } from "react-router-dom";
function ListBlogMember() {
  const navigate = new useNavigate();
  const [input, SetInput] = useState([]);
  useEffect(() => {
    apiMember
      .get("blog/getall")
      .then((res) => {
        console.log(res.data);
        SetInput(res.data);
      })
      .catch((error) => console.log(error));
  }, []);
  function renderdata() {
    return input.map((value, index) => {
      return (
        <div className="container" key={index}>
          <div className="title">
            <h5>{value.title}</h5>
          </div>
          <div className="content">
            <img src={`http://localhost:3001/${value.image}`}></img>
            <div>{value.description}</div>
            <button>
              <a onClick={() => handleBlogDetail(value.id)}>Read more</a>
            </button>
          </div>
        </div>
      );
    });
  }
  function handleBlogDetail(id) {
    navigate("/member/blog/detail/" + id);
  }
  return (
    <div className="blog_member">
      <h3>List Blog</h3>
      {renderdata()}
    </div>
  );
}
export default ListBlogMember;
