import { Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart } from 'recharts';
import classNames from 'classnames/bind';
import styles from './RevenueLineChart.module.scss';
const cx = classNames.bind(styles);
const RevenueLineChart = ({ data }) => {
    return (
        <div className={cx('chart-wrapper')}>
            <ResponsiveContainer width="100%" height={260} margin-top="40px">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="4 4" />

                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(v) => `${v / 1000}k`} />

                    <Tooltip formatter={(v) => `${v.toLocaleString('vi-VN')} đ`} />

                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#ff4d2d"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueLineChart;
