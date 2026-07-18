const BASE_URL = "http://127.0.0.1:8000";

const token = () => localStorage.getItem("token");

const headers = (json = true) => {
    const h = {
        Authorization: `Bearer ${token()}`
    };

    if (json) {
        h["Content-Type"] = "application/json";
    }

    return h;
};

/* ---------------- USER ---------------- */

export const getMe = async () =>
    (await fetch(`${BASE_URL}/me`, { headers: headers(false) })).json();

/* ---------------- AUTH ---------------- */

export const signup = async (data) =>
(
    await fetch(`${BASE_URL}/signup`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    })
).json();

export const login = async (email, password) => {

    const formData = new URLSearchParams();

    formData.append("username", email);

    formData.append("password", password);

    const response = await fetch(

        `${BASE_URL}/login`,

        {

            method: "POST",

            body: formData

        }

    );

    const data = await response.json();

    if (response.ok) {

        localStorage.setItem(

            "token",

            data.access_token

        );

    }

    return data;

};
/* ---------------- PLANS ---------------- */

/* ================= PLANS ================= */

export async function getPlans() {

    const res = await fetch(`${BASE_URL}/plans`, {

        headers: headers(false),

    });

    return await res.json();

}

export async function createPlan(plan) {

    const res = await fetch(`${BASE_URL}/plans`, {

        method: "POST",

        headers: headers(),

        body: JSON.stringify(plan),

    });

    return await res.json();

}

export async function updatePlan(id, plan) {

    const res = await fetch(`${BASE_URL}/plans/${id}`, {

        method: "PUT",

        headers: headers(),

        body: JSON.stringify(plan),

    });

    return await res.json();

}

export async function deletePlan(id) {

    const res = await fetch(`${BASE_URL}/plans/${id}`, {

        method: "DELETE",

        headers: headers(false),

    });

    return await res.json();

}
/* ---------------- CUSTOMERS ---------------- */

export const createCustomer=async(data)=>

    (

        await fetch(

            `${BASE_URL}/customers`,

            {

                method:"POST",

                headers:headers(),

                body:JSON.stringify(data)

            }

        )

    ).json();

export const getCustomers = async () =>
    (await fetch(`${BASE_URL}/customers`, {
        headers: headers(false),
    })).json();

export const deleteCustomer = async (id) =>

    fetch(

        `${BASE_URL}/customers/${id}`,

        {

            method:"DELETE",

            headers:headers()

        }

    );

export const updateCustomer = async (id,data)=>

    (

        await fetch(

            `${BASE_URL}/customers/${id}`,

            {

                method:"PUT",

                headers:headers(),

                body:JSON.stringify(data)

            }

        )

    ).json();

/* ---------------- SUBSCRIPTIONS ---------------- */

/* ---------------- SUBSCRIPTIONS ---------------- */

export const createSubscription = async (data) =>

    (

        await fetch(

            `${BASE_URL}/subscriptions`,

            {

                method: "POST",

                headers: headers(),

                body: JSON.stringify(data)

            }

        )

    ).json();

export const getSubscriptions = async () =>

    (

        await fetch(

            `${BASE_URL}/subscriptions`,

            {

                headers: headers(false)

            }

        )

    ).json();

export const updateSubscription = async (id,data) =>

    (

        await fetch(

            `${BASE_URL}/subscriptions/${id}`,

            {

                method: "PUT",

                headers: headers(),

                body: JSON.stringify(data)

            }

        )

    ).json();

export const deleteSubscription = async (id) =>

    (

        await fetch(

            `${BASE_URL}/subscriptions/${id}`,

            {

                method: "DELETE",

                headers: headers(false)

            }

        )

    ).json();

/* ---------------- BILLING ---------------- */

/* ---------------- BILLING CYCLES ---------------- */

export const getBillingCycles = async () =>
    (
        await fetch(`${BASE_URL}/billing-cycles`, {
            headers: headers(false),
        })
    ).json();

export const createBillingCycle = async (data) =>
    (
        await fetch(`${BASE_URL}/billing-cycles`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify(data)
        })
    ).json();

export const updateBillingCycle = async (id, data) =>
    (
        await fetch(`${BASE_URL}/billing-cycles/${id}`, {
            method: "PUT",
            headers: headers(),
            body: JSON.stringify(data)
        })
    ).json();

export const deleteBillingCycle = async (id) =>
    (
        await fetch(`${BASE_URL}/billing-cycles/${id}`, {
            method: "DELETE",
            headers: headers(false)
        })
    ).json();

/* ---------------- INVOICES ---------------- */

export const getInvoices = async () =>
(
    await fetch(`${BASE_URL}/invoices`, {
        headers: headers(false)
    })
).json();

export const createInvoice = async (data) =>
(
    await fetch(`${BASE_URL}/invoices`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(data)
    })
).json();

export const updateInvoice = async (id, data) =>
(
    await fetch(`${BASE_URL}/invoices/${id}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(data)
    })
).json();

export const deleteInvoice = async (id) =>
(
    await fetch(`${BASE_URL}/invoices/${id}`, {
        method: "DELETE",
        headers: headers(false)
    })
).json();

export const generateInvoices = async (taxRate = 0.0) => {
    const res = await fetch(`${BASE_URL}/invoices/generate?tax_rate=${taxRate}`, {
        method: "POST",
        headers: headers(false)
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to generate invoices");
    }
    return await res.json();
};


/* ---------------- PAYMENTS ---------------- */

export const getPayments = async () =>
(
    await fetch(`${BASE_URL}/payments`, {
        headers: headers(false)
    })
).json();

export const createPayment = async (data) =>
(
    await fetch(`${BASE_URL}/payments`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(data)
    })
).json();

export const updatePayment = async (id, data) =>
(
    await fetch(`${BASE_URL}/payments/${id}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(data)
    })
).json();

export const deletePayment = async (id) =>
(
    await fetch(`${BASE_URL}/payments/${id}`, {
        method: "DELETE",
        headers: headers(false)
    })
).json();

/* ---------------- PAYMENTS (Mock Gateway) ---------------- */

export const processPayment = async (invoiceId, amount) => {
    const res = await fetch(`${BASE_URL}/payments/process`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
            invoice_id: invoiceId,
            amount: amount
        })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Payment processing failed");
    }
    return await res.json();
};

export async function getFailedPayments() {
    const response = await fetch(`${BASE_URL}/payments/failed`, {
        headers: headers(false)
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to fetch failed payments");
    }

    return response.json();
}

export async function retryPayment(paymentId) {

    const response = await fetch(
        `${BASE_URL}/payments/retry/${paymentId}`,
        {
            method: "POST",
            headers: headers(false)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Retry failed");
    }

    return data;
}

/* ---------------- REFUNDS ---------------- */

export async function processRefund(
    paymentId,
    amount,
    reason
) {

    const response = await fetch(
        `${BASE_URL}/payments/refund`,
        {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({
                payment_id: paymentId,
                amount,
                reason
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.detail || "Refund processing failed"
        );

    }

    return data;
}
/* ---------------- AUDIT LOGS ---------------- */

export const getAuditLogs = async () =>
(
    await fetch(`${BASE_URL}/audit-logs`, {
        headers: headers(false)
    })
).json();

export const createAuditLog = async (data) =>
(
    await fetch(`${BASE_URL}/audit-logs`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(data)
    })
).json();

export const updateAuditLog = async (id, data) =>
(
    await fetch(`${BASE_URL}/audit-logs/${id}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(data)
    })
).json();

export const deleteAuditLog = async (id) =>
(
    await fetch(`${BASE_URL}/audit-logs/${id}`, {
        method: "DELETE",
        headers: headers(false)
    })
).json();

export const getMyInvoices = async () =>
(
    await fetch(
        `${BASE_URL}/my-invoices`,
        {
            headers: headers(true),
        }
    )
).json();

export const getMyPayments = async () =>
(
    await fetch(`${BASE_URL}/my-payments`, {
        headers: headers(false)
    })
).json();

export const changeMyPlan = async (planId) => {

    const response = await fetch(
        `${BASE_URL}/my-subscription/change-plan`,
        {
            method: "POST",
            headers: headers(true),
            body: JSON.stringify({
                new_plan_id: planId
            })
        }
    );

    return response.json();

};

export const previewMyPlanProration = async (planId) => {
    const res = await fetch(
        `${BASE_URL}/my-subscription/proration-preview?new_plan_id=${planId}`,
        {
            headers: headers(false)
        }
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to load proration preview");
    }
    return res.json();
};

export const pauseMySubscription = async () =>
(
    await fetch(`${BASE_URL}/my-subscription/pause`, {
        method: "POST",
        headers: headers(true)
    })
).json();

export const resumeMySubscription = async () =>
(
    await fetch(`${BASE_URL}/my-subscription/resume`, {
        method: "POST",
        headers: headers(true)
    })
).json();

export const cancelMySubscription = async () =>
(
    await fetch(`${BASE_URL}/my-subscription/cancel`, {
        method: "POST",
        headers: headers(true)
    })
).json();

export const getMyPlanHistory = async () =>
(
    await fetch(`${BASE_URL}/my-subscription/plan-history`, {
        headers: headers(false)
    })
).json();
