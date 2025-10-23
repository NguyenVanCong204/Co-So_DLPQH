import logo from "./logo.svg";
import "./App.css";
import Header from "./component/Header";
import { UserProvider } from "./Context/MemberCartContext";
import store from "./Store/store";
import { Provider } from "react-redux";
import Footer from "./component/Footer";
import LeftSide from "./component/LeftSide";
import { useLocation } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import LeftSideMyPD from "./component/LeftSideMyPD";
import HeaderAdmin from "./Admin/Component/HeaderAdmin";
import Sidebar from "./Admin/Component/Sidebar";
function App(props) {
  const location = useLocation();
  const isCheckoutPage = location.pathname.includes("/checkout");
  const isMyProduct = location.pathname.includes("/account");
  const admin = location.pathname.includes("/admin");
  const addmin = location.pathname.includes("/addmin");

  return (
    <div>
      {addmin ? (
        <div>{props.children}</div>
      ) : admin ? (
        <div className="admin-layout">
          <Sidebar />
          <div className="admin-right">
            <HeaderAdmin />
            <div className="admin-content">{props.children}</div>
          </div>
        </div>
      ) : (
        <UserProvider>
          <Provider store={store}>
            <div>
              {<Header />}
              <div className="container">
                <div className="row">
                  {isCheckoutPage ? (
                    props.children
                  ) : isMyProduct ? (
                    <div>
                      <LeftSideMyPD />
                      <div className="col-sm-9">{props.children}</div>
                    </div>
                  ) : (
                    <div>
                      <LeftSide />
                      <div className="col-sm-9">{props.children}</div>
                    </div>
                  )}
                </div>
              </div>
              {<Footer />}
            </div>
          </Provider>
        </UserProvider>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
