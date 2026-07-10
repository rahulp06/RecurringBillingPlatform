import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

import { useEffect, useState } from "react";
import { getPayments } from "../../services/api";

function RevenueChart() {

    const [data, setData] = useState([]);

    useEffect(() => {

        loadRevenue();

    }, []);

    const loadRevenue = async () => {

        try {

            const payments = await getPayments();

            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ];

            const revenueMap = {};

            months.forEach(month => {

                revenueMap[month] = 0;

            });

            payments.forEach(payment => {

                const date = new Date(payment.payment_date);

                const month = months[date.getMonth()];

                revenueMap[month] += payment.amount;

            });

            const chartData = months.map(month => ({

                month,

                revenue: revenueMap[month]

            }));

            setData(chartData);

        } catch (err) {

            console.error(err);

        }

    };

    return (

        <ResponsiveContainer
            width="100%"
            height={320}
        >

            <LineChart data={data}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#635BFF"
                    strokeWidth={3}
                />

            </LineChart>

        </ResponsiveContainer>

    );

}

export default RevenueChart;