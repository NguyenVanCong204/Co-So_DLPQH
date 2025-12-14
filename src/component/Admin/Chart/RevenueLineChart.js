import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const RevenueLineChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={260} margin="40px 14px 0px 0px">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff4d2d" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#ff4d2d" stopOpacity={0} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} đ`} />

                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ff4d2d"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    dot={{ r: 4, fill: '#ff4d2d' }}
                    activeDot={{ r: 6 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default RevenueLineChart;
