import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

function RevenueChart({ dashboard }) {

    const data = dashboard?.revenueByPlan || [];

    return (
        <ResponsiveContainer
            width="100%"
            height={320}
        >
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plan" />
                <YAxis />
                <Tooltip />

                <Bar
                    dataKey="revenue"
                    fill="#635BFF"
                    radius={[6, 6, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default RevenueChart;