import {
    getCustomers,
    getPlans,
    getInvoices,
    getPayments,
    getDashboardSummary,
    getRevenueByPlan,
    getSubscriptionMetrics
} from "./api";

export async function getDashboardData() {

    const [
        summary,
        revenueByPlan,
        subscriptionMetrics,
        customers,
        plans,
        invoices,
        payments
    ] = await Promise.all([
        getDashboardSummary(),
        getRevenueByPlan(),
        getSubscriptionMetrics(),
        getCustomers(),
        getPlans(),
        getInvoices(),
        getPayments()
    ]);

    return {
        ...summary,
        revenueByPlan,
        subscriptionMetrics,
        customers,
        plans,
        invoices,
        payments
    };
}