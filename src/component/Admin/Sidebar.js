import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css"; // Import file CSS
import {
  FaHome,
  FaUser,
  FaNewspaper,
  FaGlobeAsia,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
const Sidebar = () => {
  const navigate = useNavigate();
  function Logout() {
    localStorage.clear();
    navigate("/admin/login");
    toast.success("Logout thành công");
  }
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <a href="#">
            <FaHome className="icon" />
            <span>Home</span>
          </a>
        </li>
        <li>
          <Link to="/dashboard/update/admin">
            <FaUser className="icon" />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/blog/list">
            <FaNewspaper className="icon" />
            <span>Blogs</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/country/list">
            <FaGlobeAsia className="icon" />
            <span>Country</span>
          </Link>
        </li>
        <li>
          <a onClick={() => Logout()}>
            <FaSignOutAlt className="icon" />
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
