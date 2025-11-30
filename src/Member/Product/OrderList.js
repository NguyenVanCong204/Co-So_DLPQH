import { useEffect, useState } from 'react';
import apiMember from '../../API/apiMember';
import refershToken from '../../RefershToken/RefershToken';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { confirmDialog } from '../../component/confirmDialog';
import './OrderList.css';

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

function OrderList() {
    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('IdUser');
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeTab, setActiveTab] = useState('waiting');

    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };

    const getOrders = async () => {
        try {
            const res = await apiMember.get(`/order/user/${idUser}`, config);
            setOrders(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    const newtoken = await refershToken();
                    if (!newtoken) {
                        return toast.error('Không thể làm mới token. Vui lòng đăng nhập lại.');
                    }
                    const newConfig = {
                        headers: {
                            Authorization: `Bearer ${newtoken}`,
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    };
                    const res2 = await apiMember.get(`/order/user/${idUser}`, newConfig);
                    setOrders(Array.isArray(res2.data.data) ? res2.data.data : []);
                } catch (refreshError) {
                    toast.error('Lỗi khi làm mới token. Vui lòng đăng nhập lại.');
                }
            } else if (error.response?.status === 403) {
                toast.error(
                    'Bạn đang đăng nhập với quyền Admin. Vui lòng đăng nhập lại với tài khoản Member để xem đơn hàng.',
                );
            } else {
                toast.error('Không thể tải danh sách đơn hàng.');
            }
        }
    };

    useEffect(() => {
        if (idUser) {
            getOrders();
        }
    }, [idUser]);

    const handleMarkAsDelivered = async (orderId) => {
        const result = await confirmDialog({
            title: 'Xác nhận đã nhận hàng?',
            text: 'Bạn có chắc chắn đã nhận được sản phẩm này không?',
            confirmText: 'Xác nhận',
        });
        if (!result.isConfirmed) return;

        try {
            const res = await apiMember.put(`/order/${orderId}/delivered`, {}, config);
            toast.success(res.data.message);
            getOrders();
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    const newtoken = await refershToken();
                    if (!newtoken) {
                        return toast.error('Không thể làm mới token. Vui lòng đăng nhập lại.');
                    }
                    const newConfig = {
                        headers: {
                            Authorization: `Bearer ${newtoken}`,
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    };
                    const res2 = await apiMember.put(`/order/${orderId}/delivered`, {}, newConfig);
                    toast.success(res2.data.message);
                    getOrders();
                } catch (refreshError) {
                    toast.error('Lỗi khi làm mới token. Vui lòng đăng nhập lại.');
                }
            } else {
                toast.error('Không thể cập nhật trạng thái đơn hàng.');
            }
        }
    };

    const handleCancelOrder = async (orderId) => {
        const result = await confirmDialog({
            title: 'Xác nhận hủy đơn hàng?',
            text: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
            confirmText: 'Hủy đơn hàng',
        });
        if (!result.isConfirmed) return;

        try {
            const res = await apiMember.put(`/order/${orderId}/cancel`, {}, config);
            toast.success(res.data.message);
            getOrders();
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    const newtoken = await refershToken();
                    if (!newtoken) {
                        return toast.error('Không thể làm mới token. Vui lòng đăng nhập lại.');
                    }
                    const newConfig = {
                        headers: {
                            Authorization: `Bearer ${newtoken}`,
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    };
                    const res2 = await apiMember.put(`/order/${orderId}/cancel`, {}, newConfig);
                    toast.success(res2.data.message);
                    getOrders();
                } catch (refreshError) {
                    toast.error('Lỗi khi làm mới token. Vui lòng đăng nhập lại.');
                }
            } else {
                toast.error(error.response?.data?.error || 'Không thể hủy đơn hàng.');
            }
        }
    };

    const getOrdersByStatus = (status) => {
        return orders.filter((order) => order.status === status);
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

    const renderOrderCard = (orderGroup, status) => {
        const orderCode = Object.keys(orderGroup)[0];
        const items = orderGroup[orderCode];
        const firstOrder = items[0];
        const total = items.reduce((sum, item) => sum + item.price * item.qualty, 0);

        return (
            <div key={orderCode} className="order-card">
                <div className="order-header">
                    <div>
                        <strong>Mã đơn hàng: {orderCode}</strong>
                        <span className="order-date">
                            <i className="fas fa-clock" style={{ marginRight: '5px' }}></i>
                            {formatDate(firstOrder.createdAt)}
                        </span>
                    </div>
                    <div className="order-status-badge">
                        {status === 0 && <span className="badge waiting">Chờ xác nhận</span>}
                        {status === 1 && <span className="badge delivery">Chờ giao hàng</span>}
                        {status === 2 && <span className="badge delivered">Đã giao hàng</span>}
                        {status === 3 && (
                            <span className="badge cancelled" style={{ backgroundColor: '#dc3545' }}>
                                Đã hủy
                            </span>
                        )}
                    </div>
                </div>

                <div className="order-items">
                    {items.map((item, idx) => {
                        const product = item.id_product;
                        if (!product) return null;
                        let image = [];
                        try {
                            image = JSON.parse(product.image || '[]');
                        } catch {
                            image = [];
                        }

                        return (
                            <div key={idx} className="order-item">
                                <img src={`http://localhost:3001/${image[0] || 'no-image.png'}`} alt={product.name} />
                                <div className="order-item-info">
                                    <Link to={`/member/home/product/detail/${product._id}`}>
                                        <h4>{product.name}</h4>
                                    </Link>
                                    <p>Số lượng: {item.qualty}</p>
                                    <p>Giá: {formatPrice(item.price)}</p>
                                    {/* <p>Tổng: {formatPrice(item.price * item.qualty)}</p> */}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="order-footer">
                    <div className="order-total">
                        <strong>Tổng cộng: {formatPrice(total)}</strong>
                        <p>
                            Phương thức thanh toán:{' '}
                            {firstOrder.paymentMethod === 'paypal' ? 'PayPal' : 'Tiền mặt (COD)'}
                        </p>
                        {firstOrder.address && <p>Địa chỉ: {firstOrder.address}</p>}
                    </div>
                    {status === 0 && (
                        <button
                            className="btn-cancel"
                            style={{
                                padding: '8px 15px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginLeft: '10px',
                            }}
                            onClick={() => handleCancelOrder(items[0]._id)}
                        >
                            Hủy đơn hàng
                        </button>
                    )}
                    {status === 1 && (
                        <button className="btn-delivered" onClick={() => handleMarkAsDelivered(items[0]._id)}>
                            Đã nhận hàng
                        </button>
                    )}
                    {status === 2 && (
                        <button
                            className="btn-view-details"
                            onClick={() => setSelectedOrder({ orderCode, items, total, firstOrder })}
                        >
                            Xem chi tiết
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        let ordersToShow = [];
        if (activeTab === 'waiting') {
            ordersToShow = getOrdersByStatus(0);
        } else if (activeTab === 'delivery') {
            ordersToShow = getOrdersByStatus(1);
        } else if (activeTab === 'delivered') {
            ordersToShow = getOrdersByStatus(2);
        } else {
            ordersToShow = getOrdersByStatus(3);
        }

        const grouped = groupOrdersByCode(ordersToShow);
        const orderGroups = Object.entries(grouped).map(([code, items]) => ({
            [code]: items,
        }));

        if (orderGroups.length === 0) {
            return (
                <div className="empty-orders">
                    <p>Chưa có đơn hàng nào trong mục này.</p>
                </div>
            );
        }

        return (
            <div className="orders-container">
                {orderGroups.map((group) => {
                    let status = 0;
                    if (activeTab === 'delivery') status = 1;
                    if (activeTab === 'delivered') status = 2;
                    if (activeTab === 'cancelled') status = 3;
                    return renderOrderCard(group, status);
                })}
            </div>
        );
    };

    return (
        <div className="order-list-page">
            <h2>QUẢN LÝ ĐƠN HÀNG</h2>

            <div className="order-tabs">
                <button className={activeTab === 'waiting' ? 'active' : ''} onClick={() => setActiveTab('waiting')}>
                    Chờ xác nhận ({getOrdersByStatus(0).length})
                </button>
                <button className={activeTab === 'delivery' ? 'active' : ''} onClick={() => setActiveTab('delivery')}>
                    Chờ giao hàng ({getOrdersByStatus(1).length})
                </button>
                <button className={activeTab === 'delivered' ? 'active' : ''} onClick={() => setActiveTab('delivered')}>
                    Đã giao hàng ({getOrdersByStatus(2).length})
                </button>
                <button className={activeTab === 'cancelled' ? 'active' : ''} onClick={() => setActiveTab('cancelled')}>
                    Đã hủy ({getOrdersByStatus(3).length})
                </button>
            </div>

            {renderTabContent()}

            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Chi tiết đơn hàng</h3>
                            <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="order-detail-section">
                                <p>
                                    <strong>Mã đơn hàng:</strong> {selectedOrder.orderCode}
                                </p>
                                <p>
                                    <strong>Trạng thái:</strong> <span className="badge delivered">Đã giao hàng</span>
                                </p>
                                <p>
                                    <strong>Ngày đặt:</strong> {formatDate(selectedOrder.firstOrder.createdAt)}
                                </p>
                                <p>
                                    <strong>Phương thức thanh toán:</strong>{' '}
                                    {selectedOrder.firstOrder.paymentMethod === 'paypal' ? 'PayPal' : 'Tiền mặt (COD)'}
                                </p>
                                {selectedOrder.firstOrder.address && (
                                    <p>
                                        <strong>Địa chỉ giao hàng:</strong> {selectedOrder.firstOrder.address}
                                    </p>
                                )}
                            </div>

                            <div className="order-detail-products">
                                <h4>Sản phẩm:</h4>
                                {selectedOrder.items.map((item, idx) => {
                                    const product = item.id_product;
                                    if (!product) return null;
                                    let image = [];
                                    try {
                                        image = JSON.parse(product.image || '[]');
                                    } catch {
                                        image = [];
                                    }

                                    return (
                                        <div key={idx} className="detail-product-item">
                                            <img
                                                src={`http://localhost:3001/${image[0] || 'no-image.png'}`}
                                                alt={product.name}
                                            />
                                            <div className="detail-product-info">
                                                <Link to={`/member/home/product/detail/${product._id}`}>
                                                    <h4>{product.name}</h4>
                                                </Link>
                                                <p>Giá: {formatPrice(item.price)}</p>
                                                <p>Số lượng: {item.qualty}</p>
                                                <p>Tổng: {formatPrice(item.price * item.qualty)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="order-detail-total">
                                <strong>Tổng cộng: {formatPrice(selectedOrder.total)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderList;
