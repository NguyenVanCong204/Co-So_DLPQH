import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import UpdateAdmin from './Admin/UpdateAdmin';
import RegisterMember from './Member/User/Register';
import LoginMember from './Member/User/Login';
import UpdateMember from './Member/User/Update';
import ListBlogMember from './Member/Blog/ListBlog';
import BlogDetail from './Member/Blog/BlogDetail';
import ProductAdd from './Member/Product/ProductAdd';
import OrderList from './Member/Product/OrderList';
import ProductUpdate from './Member/Product/ProductUpdate';
import HomeList from './Member/Home/HomeList';
import ProductDetail from './Member/Home/ProductDetail';
import CartProduct from './Member/Product/CartProduct';
import CheckOut from './Member/Product/CheckOut';
import LoginTest from './Admin/LoginTest';
import RegisterTest from './Admin/RegisterTest';
import OrderListAdmin from './Admin/Pages/Order/OrderListAdmin';
import ProductListAdmin from './Admin/Pages/Product/ProductList';
import CreateProduct from './Admin/Pages/Product/CreateProduct/CreateProduct';
import UpdateProduct from './Admin/Pages/Product/UpdateProduct/UpdateProduct';
import TrashProduct from './Admin/Pages/Product/TrashProduct/TrashProduct';
import Category from './Admin/Pages/Category/Category';
import Brand from './Admin/Pages/Brand/Brand';
import MemberProtectedRoute from './component/Member/MemberProtectedRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <PayPalScriptProvider
            options={{
                'client-id': 'AYQS_sP-Z621V45RGGTyYaIcwGnOhpnV0-WrPG7yNsnUGMPiRG_mkaYm_wW_sNmjhM5eDA-q1_88u_pq',
                currency: 'USD',
                components: 'buttons',
            }}
        >
            <BrowserRouter>
                <App>
                    <Routes>
                        <Route path="/admin/register" element={<RegisterTest />} />
                        <Route path="/admin/login" element={<LoginTest />} />
                        <Route path="/admin/order-list" element={<OrderListAdmin />} />
                        <Route path="/admin/product-list" element={<ProductListAdmin />} />
                        <Route path="/admin/product/create-product" element={<CreateProduct />} />
                        <Route path="/admin/product/update-product" element={<UpdateProduct />} />
                        <Route path="/admin/product/trash-product" element={<TrashProduct />} />
                        <Route path="/admin/update-profile" element={<UpdateAdmin />} />
                        <Route path="/admin/category" element={<Category />} />
                        <Route path="/admin/brand" element={<Brand />} />
                        <Route path="/member/register" element={<RegisterMember />} />
                        <Route index path="/" element={<LoginMember />} />
                        <Route path="/member/account/update" element={<UpdateMember />} />
                        <Route path="/member/blog/list" element={<ListBlogMember />} />
                        <Route path="/member/blog/detail/:id" element={<BlogDetail />} />
                        <Route path="/member/account/product/add" element={<ProductAdd />} />
                        <Route path="/member/account/product/list" element={<OrderList />} />
                        <Route path="/member/account/product/update/:id" element={<ProductUpdate />} />
                        <Route path="/member/home" element={<HomeList />} />
                        <Route path="/member/category/:categoryId" element={<HomeList />} />
                        <Route path="/member/home/product/detail/:id" element={<ProductDetail />} />
                        <Route
                            path="/member/home/cart"
                            element={
                                <MemberProtectedRoute>
                                    <CartProduct />
                                </MemberProtectedRoute>
                            }
                        />
                        <Route
                            path="/member/product/checkout"
                            element={
                                <MemberProtectedRoute>
                                    <CheckOut />
                                </MemberProtectedRoute>
                            }
                        />
                    </Routes>
                </App>
            </BrowserRouter>
        </PayPalScriptProvider>
    </React.StrictMode>,
);

reportWebVitals();
