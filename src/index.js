import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import UpdateAdmin from './Admin/UpdateAdmin';
import ListCountry from './Admin/Pages/Country/ListCountry';
import ProductListAdmin from './Admin/Pages/Product/ProductList';
import RegisterMember from './Member/User/Register';
import LoginMember from './Member/User/Login';
import UpdateMember from './Member/User/Update';
import ListBlogMember from './Member/Blog/ListBlog';
import BlogDetail from './Member/Blog/BlogDetail';
import ProductAdd from './Member/Product/ProductAdd';
import ProductList from './Member/Product/ProductList';
import ProductUpdate from './Member/Product/ProductUpdate';
import HomeList from './Member/Home/HomeList';
import ProductDetail from './Member/Home/ProductDetail';
import CartProduct from './Member/Product/CartProduct';
import CheckOut from './Member/Product/CheckOut';
import LoginTest from './Admin/LoginTest';
import RegisterTest from './Admin/RegisterTest';
import CreateProduct from './Admin/Pages/Product/CreateProduct/CreateProduct';
import UpdateProduct from './Admin/Pages/Product/UpdateProduct/UpdateProduct';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App>
                <Routes>
                    <Route path="/admin/register" element={<RegisterTest />} />
                    <Route path="/admin/login" element={<LoginTest />} />
                    <Route path="/admin/product-list" element={<ProductListAdmin />} />
                    <Route path="/admin/product/create-product" element={<CreateProduct />} />
                    <Route path="/admin/product/update-product" element={<UpdateProduct />} />
                    <Route path="/admin/update-profile" element={<UpdateAdmin />} />
                    <Route path="/admin/country-list" element={<ListCountry />} />
                    <Route path="/member/register" element={<RegisterMember />} />
                    <Route index path="/" element={<LoginMember />} />
                    <Route path="/member/account/update" element={<UpdateMember />} />
                    <Route path="/member/blog/list" element={<ListBlogMember />} />
                    <Route path="/member/blog/detail/:id" element={<BlogDetail />} />
                    <Route path="/member/account/product/add" element={<ProductAdd />} />
                    <Route path="/member/account/product/list" element={<ProductList />} />
                    <Route path="/member/account/product/update/:id" element={<ProductUpdate />} />
                    <Route path="/member/home" element={<HomeList />} />
                    <Route path="/member/home/product/detail/:id" element={<ProductDetail />} />
                    <Route path="/member/home/cart" element={<CartProduct />} />
                    <Route path="/member/product/checkout" element={<CheckOut />} />
                </Routes>
            </App>
        </BrowserRouter>
    </React.StrictMode>,
);
reportWebVitals();
