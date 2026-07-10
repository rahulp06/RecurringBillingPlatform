import { useEffect, useState } from "react";

import Sidebar from "../../components/admin/AdminSidebar";
import Topbar from "../../components/admin/AdminTopbar";
import DataTable from "../../components/admin/DataTable";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

import {
    getBillingCycles,
    getSubscriptions,
    getCustomers,
    getPlans
} from "../../services/api";

function BillingCycles() {

    const [billingCycles, setBillingCycles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadBillingCycles();

    }, []);

    const loadBillingCycles = async () => {

        setLoading(true);

        try {

            const [

                cycles,
                subscriptions,
                customers,
                plans

            ] = await Promise.all([

                getBillingCycles(),
                getSubscriptions(),
                getCustomers(),
                getPlans()

            ]);

            const customerMap = {};

            customers.forEach(customer => {

                customerMap[customer.id] = customer.name;

            });

            const planMap = {};

            plans.forEach(plan => {

                planMap[plan.id] = plan.name;

            });

            const subscriptionMap = {};

            subscriptions.forEach(subscription => {

                subscriptionMap[subscription.id] = {

                    customer: customerMap[subscription.customer_id],

                    plan: planMap[subscription.plan_id]

                };

            });

            const formatted = cycles.map(cycle => ({

                id: cycle.id,

                subscription:
                    `${subscriptionMap[cycle.subscription_id]?.customer} • ${subscriptionMap[cycle.subscription_id]?.plan}`,

                cycle_start: cycle.cycle_start_date,

                cycle_end: cycle.cycle_end_date,

                status: cycle.status,

                renewal_date: cycle.renewal_date,

                subscription_id: cycle.subscription_id

            }));

            setBillingCycles(formatted);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="layout">

            <Sidebar />

            <div className="main">

                <Topbar />

                <div className="dashboard">

                    <div className="page-header">

                        <div>

                            <h1>Billing Cycles</h1>

                            <p> Monitor recurring billing cycles.</p>

                        </div>

                    </div>

                    {

                        loading

                        ?

                        <Loading />

                        :

                        billingCycles.length === 0

                        ?

                        <EmptyState

                            title="No Billing Cycles"

                            message="No billing cycles found."

                        />

                        :

                        <DataTable

                            title="Recurring Billing Cycles"

subtitle="Current billing periods"

                            columns={[

                                "Subscription",

                                "Cycle Start",

                                "Cycle End",

                                "Status"

                            ]}

                            data={billingCycles}

                        />

                    }

                </div>

            </div>

        </div>

    );

}

export default BillingCycles;