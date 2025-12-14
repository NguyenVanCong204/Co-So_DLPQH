import classNames from 'classnames/bind';
import { MdFilterAlt } from 'react-icons/md';
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
    useEffect(() => {
        const fetchData = async () => {
            await fetchDashboard(range);
            await fetchRevenueChart(range);
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
                <div className={cx('data-overview-list')}>
                    <div className={cx('data-overview-item')}>
                        <span className={cx('title')}>Doanh thu</span>
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
                        <span className={cx('title')}>Đơn đã hủy</span>
                        <span className={cx('content')}>{overview.canceledOrders}</span>
                    </div>
                </div>
                <RevenueLineChart data={chartData} />
            </div>
        </div>
    );
}

export default Dashboard;
