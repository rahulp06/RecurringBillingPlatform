import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const COLORS = [
    "#635BFF",
    "#8B5CF6",
    "#C4B5FD",
    "#10B981"
];

function RevenuePie({ dashboard }) {

    const metrics = dashboard?.subscriptionMetrics || {};

    const data = [
        {
            name: "Active",
            value: metrics.active || 0
        },
        {
            name: "Trial",
            value: metrics.trial || 0
        },
        {
            name: "Past Due",
            value: metrics.past_due || 0
        },
        {
            name: "Cancelled",
            value: metrics.cancelled || 0
        }
    ];

    return (
        <ResponsiveContainer
            width="100%"
            height={320}
        >
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    outerRadius={110}
                    label
                >
                    {data.map((_, index) => (
                        <Cell
                            key={index}
                            fill={COLORS[index]}
                        />
                    ))}
                </Pie>

                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
}

export default RevenuePie;