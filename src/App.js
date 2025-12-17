import './App.css';
import Header from './component/Member/Header';
import { UserProvider } from './Context/MemberCartContext';
import store from './Store/store';
import { Provider } from 'react-redux';
import Footer from './component/Member/Footer';
import LeftSide from './component/Member/LeftSide';
import { useLocation } from 'react-router-dom';
import { ToastContainer, Bounce } from 'react-toastify';
import LeftSideMyPD from './component/Member/LeftSideMyPD';
import DefaultLayout from './Admin/Layouts/DefaultLayout';
function App(props) {
    const location = useLocation();
    const path = location.pathname;
    const isCheckoutPage = path.includes('/checkout');
    const isProductDetail = path.includes('/product/detail');
    const isCartPage = path.includes('/cart');
    const isLoginPage = path.includes('/login') || path === '/' || path.includes('/register');
    const isMyProduct = path.includes('/account');
    const isAdminLogin = path === '/admin/login';
    const isAdminRegister = path === '/admin/register';
    const isAdmin = path.startsWith('/admin') && !isAdminLogin && !isAdminRegister;

    return (
        <div>
            {isAdmin ? (
                <DefaultLayout>{props.children}</DefaultLayout>
            ) : isAdminLogin || isAdminRegister ? (
                <>{props.children}</>
            ) : (
                <UserProvider>
                    <Provider store={store}>
                        <div>
                            {<Header />}
                            <div className="container">
                                <div className="row">
                                    {isCheckoutPage || isProductDetail || isCartPage || isLoginPage ? (
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
                autoClose={800}
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
