import classNames from 'classnames/bind';
import { MdFilterAlt } from 'react-icons/md';
import { FaSort } from 'react-icons/fa';
import styles from './Dashboard.module.scss';
import { useEffect, useState } from 'react';
import RevenueLineChart from '../../../component/Admin/Chart/RevenueLineChart';
import apiAdmin from '../../../API/apiAdmin';

const cx = classNames.bind(styles);
function Dashboard() {
    const [showDropdown, setShowDropdown] = useState(true);
    const [overview, setOverView] = useState([]);
    const [range, setRange] = useState('today');
    const [chartData, setChartData] = useState([]);
    const [topProduct, setTopProduct] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };
    const sortedTopProduct = [...topProduct].sort((a, b) => {
        if (!sortField) {
            return 0;
        }
        const valueA = a[sortField];
        const valueB = b[sortField];

        return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
    });

    const fetchDashboard = async (time) => {
        try {
            const data = await apiAdmin.get(`/dashboard/overview?range=${time}`);
            setOverView(data.data.overview);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchRevenueChart = async (rangeChart) => {
        try {
            const res = await apiAdmin.get(`/dashboard/chart?range=${rangeChart}`);
            setChartData(res.data.chart);
        } catch (err) {
            console.log(err);
        }
    };
    const fetchTopProduct = async (rangeTop) => {
        try {
            const res = await apiAdmin.get(`/dashboard/top-product?range=${rangeTop}`);
            setTopProduct(res.data.topProducts);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            await fetchDashboard(range);
            await fetchRevenueChart(range);
            await fetchTopProduct(range);
        };

        fetchData();
    }, [range]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('box-data-time')}>
                <div className={'filter'}>
                    <label className={cx('label-input')}>Thời gian dữ liệu</label>
                    <button className={cx('btn-filter')} onClick={() => setShowDropdown((prev) => !prev)}>
                        <MdFilterAlt />
                    </button>
                    <div
                        className={cx('menu-dropdown', {
                            'dropdown-hidden': !showDropdown,
                        })}
                    >
                        <ul className={cx('menu-dropdown-list')}>
                            <li
                                className={cx('menu-dropdown-item')}
                                onClick={() => {
                                    setRange('yesterday');
                                    setShowDropdown(true);
                                }}
                            >
                                Hôm qua
                            </li>
                            <li
                                className={cx('menu-dropdown-item')}
                                onClick={() => {
                                    setRange('7days');
                                    setShowDropdown(true);
                                }}
                            >
                                7 ngày qua
                            </li>
                            <li
                                className={cx('menu-dropdown-item')}
                                onClick={() => {
                                    setRange('15days');
                                    setShowDropdown(true);
                                }}
                            >
                                15 ngày qua
                            </li>
                            <li
                                className={cx('menu-dropdown-item')}
                                onClick={() => {
                                    setRange('30days');
                                    setShowDropdown(true);
                                }}
                            >
                                30 ngày qua
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={cx('description')}>
                    <p className={cx('content')}>Thời gian dữ liệu được cập nhật hằng ngày</p>
                </div>
            </div>
            <div className={cx('data-overview')}>
                <span className={cx('overview-title')}>Chỉ số</span>
                <div className={cx('data-overview-list')}>
                    <div className={cx('data-overview-item')}>
                        <span className={cx('title')}>Doanh thu ước tính</span>
                        <span className={cx('content')}>{(overview.totalRevenue || 0).toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className={cx('data-overview-item')}>
                        <span className={cx('title')}>Số đơn hàng</span>
                        <span className={cx('content')}>{overview.totalOrders}</span>
                    </div>
                    <div className={cx('data-overview-item')}>
                        <span className={cx('title')}>Số lượng bán</span>
                        <span className={cx('content')}>{overview.totalQuantity}</span>
                    </div>
                    <div className={cx('data-overview-item')}>
                        <span className={cx('title')}>Chờ xác nhận</span>
                        <span className={cx('content')}>{overview.pendingOrders}</span>
                    </div>
                    <div className={cx('data-overview-item')}>
                        <span className={cx('title')}>Chờ giao hàng</span>
                        <span className={cx('content')}>{overview.shippingOrders}</span>
                    </div>
                    <div className={cx('data-overview-item')}>
                        <span className={cx('title')}>Đã hoàn thành</span>
                        <span className={cx('content')}>{overview.successOrders}</span>
                    </div>
                    <div className={cx('data-overview-item')}>
                        <span className={cx('title')}>Đơn đã hủy</span>
                        <span className={cx('content')}>{overview.canceledOrders}</span>
                    </div>
                </div>
                <span className={cx('overview-title-dashboard')}>Biểu đồ doanh thu</span>
                <RevenueLineChart data={chartData} />
            </div>
            <div className={cx('top-product')}>
                <span className={cx('top-product-title')}>Top 5 sản phẩm</span>
                <table className={cx('product-table')}>
                    <thead>
                        <tr>
                            <th>Stt</th>
                            <th>Tên sản phẩm</th>
                            <th onClick={() => handleSort('totalRevenue')}>
                                Doanh thu
                                <FaSort className={cx('icon-sort')} />
                            </th>
                            <th onClick={() => handleSort('totalOrders')}>
                                Số lần đặt
                                <FaSort className={cx('icon-sort')} />
                            </th>
                            <th onClick={() => handleSort('totalQuantity')}>
                                Số lượng đặt
                                <FaSort className={cx('icon-sort')} />
                            </th>
                            <th>Ảnh</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTopProduct.map((item, index) => (
                            <tr key={item.productId}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.totalRevenue.toLocaleString('vi-VN')}đ</td>
                                <td>{item.totalOrders}</td>
                                <td>{item.totalQuantity}</td>
                                <td>
                                    <img src={`http://localhost:3001/${JSON.parse(item.image)[0]}`} alt="" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;
