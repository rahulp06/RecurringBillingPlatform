import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { useEffect, useState } from "react";

import {
    getPlans,
    getSubscriptions
} from "../../services/api";

const COLORS = [
    "#635BFF",
    "#8B5CF6",
    "#C4B5FD",
    "#10B981",
    "#F59E0B",
    "#EF4444"
];

function RevenuePie() {

    const [data, setData] = useState([]);

    useEffect(() => {

        loadDistribution();

    }, []);

    const loadDistribution = async () => {

        try {

            const [
                plans,
                subscriptions
            ] = await Promise.all([

                getPlans(),
                getSubscriptions()

            ]);

            const distribution = plans.map(plan => {

                const count =
                    subscriptions.filter(

                        sub =>

                            sub.plan_id === plan.id

                    ).length;

                return {

                    name: plan.name,

                    value: count

                };

            });

            setData(distribution);

        } catch (err) {

            console.error(err);

        }

    };

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

                    {data.map((entry, index) => (

                        <Cell
                            key={index}
                            fill={
                                COLORS[
                                    index %
                                    COLORS.length
                                ]
                            }
                        />

                    ))}

                </Pie>

                <Tooltip />

            </PieChart>

        </ResponsiveContainer>

    );

}

export default RevenuePie;