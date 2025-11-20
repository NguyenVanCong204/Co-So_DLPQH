import React, { useEffect, useState } from 'react';
import apiAdmin from '../../API/apiAdmin';
import { Link } from 'react-router-dom';
import './LeftSide.css';

function LeftSide() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        apiAdmin
            .get('/category')
            .then((res) => {
                if (Array.isArray(res.data.data)) {
                    setCategories(res.data.data);
                } else {
                    console.error('API /category did not return an array:', res.data);
                }
            })
            .catch((err) => {
                console.error('Lỗi khi tải danh mục:', err);
            });
    }, []);

    const renderCategories = () => {
        if (categories.length === 0) {
            return (
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            <a href="#">Đang tải danh mục...</a>
                        </h4>
                    </div>
                </div>
            );
        }

        return categories.map((category, index) => {
            const hasSubmenu = false;
            const uniqueId = `category-${index}`;

            return (
                <div className="panel panel-default" key={category._id}>
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            {hasSubmenu ? (
                                <a
                                    data-toggle="collapse"
                                    data-parent="#accordian"
                                    href={`#${uniqueId}`}
                                    aria-expanded="false"
                                >
                                    {category.name}
                                </a>
                            ) : (
                                <Link to={`/member/category/${category._id}`}>{category.name}</Link>
                            )}
                        </h4>
                    </div>

                    {hasSubmenu && (
                        <div id={uniqueId} className="panel-collapse collapse">
                            <div className="panel-body">
                                <ul>
                                    <li>
                                        <a href="#">Sub-item 1 </a>
                                    </li>
                                    <li>
                                        <a href="#">Sub-item 2 </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="col-sm-3">
            <div className="left-sidebar">
                <h2>DANH MỤC SẢN PHẨM</h2>
                <div className="panel-group category-products" id="accordian">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <Link to="/member/home">Tất Cả Sản Phẩm</Link>
                            </h4>
                        </div>
                    </div>

                    {renderCategories()}
                </div>
            </div>
        </div>
    );
}

export default LeftSide;
