import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from "react";
import api from "../../API/api";
import { confirmDialog } from "../../component/confirmDialog";
import { toast } from "react-toastify";
function ListCountry() {
  const [err, SetErr] = useState({});
  const [input, SetInput] = useState([]);
  const [name, SetName] = useState({
    name: "",
    id: "",
  });
  const [checkUpdate, SetCheckUpdate] = useState(true);
  function handleName(e) {
    let name = e.target.name;
    let value = e.target.value;
    SetName((states) => ({ ...states, [name]: value }));
  }
  function AddCountry() {
    let errAll = {};
    let check = true;
    if (name.name == "") {
      errAll.name = "Vui lòng nhập name";
      check = false;
    }
    if (!check) {
      SetErr(errAll);
    } else {
      const data = {
        name: name.name,
      };
      api
        .post("country/create", data)
        .then((res) => {
          console.log(res);
          toast.success("Thêm country thành công");
          getData();
          SetErr({});
          SetName({ name: "" });
        })
        .catch((error) => console.log(error));
    }
  }
  function updateCountry(id, name) {
    SetName({ id: id, name: name });
    SetCheckUpdate(false);
  }
  function update() {
    const data = {
      name: name.name,
    };
    api
      .put("country/update/" + name.id, data)
      .then((res) => {
        console.log(res);
        alert("ok");
        getData();
        SetName({
          name: "",
          id: "",
        });
      })
      .catch((error) => console.log(error));
  }
  async function deleteCountry(id) {
    const result = await confirmDialog({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa country này không?",
    });
    if (!result.isConfirmed) return;
    api
      .post("country/delete/" + id)
      .then((res) => {
        console.log(res);
        alert(res.data.message);
        getData();
      })
      .catch((error) => console.log(error));
  }
  function getData() {
    api
      .get("country/getall")
      .then((res) => {
        console.log(res);
        SetInput(res.data);
      })
      .catch((error) => console.log(error));
  }
  useEffect(() => {
    getData();
  }, []);
  function renderData() {
    return input.map((value, index) => {
      return (
        <tr key={index}>
          <td>{index}</td>
          <td>{value.name}</td>
          <td>
            <button>
              <i
                class="fa-solid fa-pen-to-square"
                onClick={() => updateCountry(value._id, value.name)}
              ></i>
            </button>
            <button>
              <i
                class="fa-solid fa-trash"
                onClick={() => deleteCountry(value._id)}
              ></i>
            </button>
          </td>
        </tr>
      );
    });
  }
  return (
    <div className="Blog_list">
      <div className="Blog_table">
        <h2>Danh sách Country</h2>
        <p className="err">{err.name}</p>
        <div className="country">
          <div className="country_input">
            <p>Id : </p>
            <input type="text" readOnly value={name.id}></input>
          </div>
          <div className="country_input">
            <p>Name : </p>
            <input
              type="text"
              onChange={handleName}
              name="name"
              value={name.name}
            ></input>
          </div>
          {checkUpdate && checkUpdate == true ? (
            <button onClick={() => AddCountry()}>Add country</button>
          ) : (
            <button onClick={() => update()}>Update country</button>
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>{renderData()}</tbody>
        </table>
      </div>
    </div>
  );
}
export default ListCountry;
