import styles from "./HeaderAdmin.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
const HeaderAdmin = () => {
  return (
    <header className={cx("admin-header")}>
      <div className="header-left">
        <h2 className="logo">Admin Panel</h2>
      </div>
      <div className="header-right">
        <input type="text" className="search-input" placeholder="Tìm kiếm..." />
      </div>
    </header>
  );
};

export default HeaderAdmin;
