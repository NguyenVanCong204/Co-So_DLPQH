import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import UpdateAdmin from "./Admin/UpdateAdmin";
import AddBlog from "./Admin/Blog/AddBlog";
import ListBlog from "./Admin/Blog/ListBlog";
import UpdateBlog from "./Admin/Blog/UpdateBlog";
import ListCountry from "./Admin/Country/ListCountry";
import RegisterMember from "./Member/User/Register";
import LoginMember from "./Member/User/Login";
import UpdateMember from "./Member/User/Update";
import ListBlogMember from "./Member/Blog/ListBlog";
import BlogDetail from "./Member/Blog/BlogDetail";
import ProductAdd from "./Member/Product/ProductAdd";
import ProductList from "./Member/Product/ProductList";
import ProductUpdate from "./Member/Product/ProductUpdate";
import HomeList from "./Member/Home/HomeList";
import ProductDetail from "./Member/Home/ProductDetail";
import CartProduct from "./Member/Product/CartProduct";
import CheckOut from "./Member/Product/CheckOut";
import LoginTest from "./Admin/LoginTest";
import RegisterTest from "./Admin/RegisterTest";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/admin/register" element={<RegisterTest />} />
          <Route path="/admin/login" element={<LoginTest />} />
          <Route path="/dashboard/update/admin" element={<UpdateAdmin />} />
          <Route path="/dashboard/blog/add" element={<AddBlog />} />
          <Route path="/dashboard/blog/list" element={<ListBlog />} />
          <Route path="/dashboard/blog/update/:id" element={<UpdateBlog />} />
          <Route path="/dashboard/country/list" element={<ListCountry />} />
          <Route path="/member/register" element={<RegisterMember />} />
          <Route index path="/" element={<LoginMember />} />
          <Route path="/member/account/update" element={<UpdateMember />} />
          <Route path="/member/blog/list" element={<ListBlogMember />} />
          <Route path="/member/blog/detail/:id" element={<BlogDetail />} />
          <Route path="/member/account/product/add" element={<ProductAdd />} />
          <Route
            path="/member/account/product/list"
            element={<ProductList />}
          />
          <Route
            path="/member/account/product/update/:id"
            element={<ProductUpdate />}
          />
          <Route path="/member/home" element={<HomeList />} />
          <Route
            path="/member/home/product/detail/:id"
            element={<ProductDetail />}
          />
          <Route path="/member/home/cart" element={<CartProduct />} />
          <Route path="/member/product/checkout" element={<CheckOut />} />
        </Routes>
      </App>
    </BrowserRouter>
  </React.StrictMode>
);
reportWebVitals();
