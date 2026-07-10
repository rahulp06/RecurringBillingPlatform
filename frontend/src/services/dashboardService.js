import {
    getCustomers,
    getPlans,
    getSubscriptions,
    getInvoices,
    getPayments
} from "./api";

export async function getDashboardData() {

    const [
        customers,
        plans,
        subscriptions,
        invoices,
        payments
    ] = await Promise.all([

        getCustomers(),

        getPlans(),

        getSubscriptions(),

        getInvoices(),

        getPayments()

    ]);

    return {

        customers,

        plans,

        subscriptions,

        invoices,

        payments

    };

}