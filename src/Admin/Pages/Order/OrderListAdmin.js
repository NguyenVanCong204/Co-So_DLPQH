import React, { useEffect, useState } from 'react';
import apiAdmin from '../../../API/apiAdmin';
import { toast } from 'react-toastify';
import { confirmDialog } from '../../../component/confirmDialog';
import './OrderListAdmin.css';

function formatPrice(price) {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function OrderListAdmin() {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('adminToken');

    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };

    const getOrders = async () => {
        try {
            const res = await apiAdmin.get('/orders', config);
            setOrders(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (error) {
            toast.error('Không thể tải danh sách đơn hàng.');
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    const handleConfirmOrder = async (orderId) => {
        const result = await confirmDialog({
            title: 'Xác nhận đơn hàng?',
            text: 'Bạn có chắc chắn muốn xác nhận đơn hàng này không?',
            confirmText: 'Xác nhận',
        });
        if (!result.isConfirmed) return;

        try {
            const res = await apiAdmin.put(`/order/${orderId}/confirm`, {}, config);
            toast.success(res.data.message);
            getOrders();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Không thể xác nhận đơn hàng.');
        }
    };

    const groupOrdersByCode = (orderList) => {
        const grouped = {};
        orderList.forEach((order) => {
            const code = order.orderCode || `ORDER-${new Date(order.createdAt).getTime()}`;
            if (!grouped[code]) {
                grouped[code] = [];
            }
            grouped[code].push(order);
        });
        return grouped;
    };

    // Filter only waiting orders (status 0)
    const waitingOrders = orders.filter((order) => order.status === 0);
    const groupedOrders = groupOrdersByCode(waitingOrders);

    return (
        <div className="admin-order-list">
            <h2>Quản lý đơn hàng chờ xác nhận</h2>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Mã đơn hàng</th>
                            <th>Ngày đặt</th>
                            <th>Khách hàng</th>
                            <th>Sản phẩm</th>
                            <th>Tổng tiền</th>
                            <th>Thanh toán</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedOrders).length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    Không có đơn hàng nào chờ xác nhận.
                                </td>
                            </tr>
                        ) : (
                            Object.entries(groupedOrders).map(([code, items]) => {
                                const firstOrder = items[0];
                                const total = items.reduce(
                                    (sum, item) => sum + item.price * (item.quantity || item.qualty),
                                    0,
                                );
                                const user = firstOrder.id_user;

                                return (
                                    <tr key={code}>
                                        <td>{code}</td>
                                        <td>{formatDate(firstOrder.createdAt)}</td>
                                        <td>
                                            {user ? (
                                                <>
                                                    <p>
                                                        <strong>{user.name}</strong>
                                                    </p>
                                                    <p>{user.phone}</p>
                                                    <p>{firstOrder.address}</p>
                                                </>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td>
                                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                                {items.map((item, idx) => (
                                                    <li key={idx} style={{ marginBottom: '5px' }}>
                                                        {item.id_product?.name} x {item.quantity || item.qualty}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td>{formatPrice(total)}</td>
                                        <td>{firstOrder.paymentMethod === 'paypal' ? 'PayPal' : 'Tiền mặt (COD)'}</td>
                                        <td>
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleConfirmOrder(items[0]._id)}
                                            >
                                                Xác nhận
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderListAdmin;
