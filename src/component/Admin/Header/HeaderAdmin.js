import styles from "./HeaderAdmin.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
const HeaderAdmin = () => {
  return (
    <header className={cx("wrapper")}>
      <div className={cx("header-left")}>
        <input type="text" className={cx("search-input")} placeholder="Tìm kiếm..." />
      </div>
      <div className={cx("header-right")}>
        <img className={cx("avatar")} src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png" alt=""/>
        <p className={cx("user-name")}>Dangchien</p>
      </div>
    </header>
  );
};

export default HeaderAdmin;
