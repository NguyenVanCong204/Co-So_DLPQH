import React from 'react';
import './Loading.css';

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
        </div>
    );
};

export default Loading;
