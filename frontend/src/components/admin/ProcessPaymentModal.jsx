import { useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import { toast } from "react-toastify";
import { processPayment } from "../../services/api";

function ProcessPaymentModal({
    open,
    invoice,
    onClose,
    onSuccess
}) {
    const [loading, setLoading] = useState(false);

    if (!open || !invoice) return null;

    const handleProcessPayment = async () => {
        const confirmed = window.confirm(
            `Process payment for ${invoice.invoice} ?`
        );

        if (!confirmed) return;
        try {
            setLoading(true);

            const result = await processPayment(
                invoice.id,
                invoice.total_amount
            );

            if (result.payment_status === "paid") {
                toast.success(result.message || "Payment processed successfully.");
            } else {
                toast.error(result.message || "Payment failed.");
            }

            onSuccess?.();
            onClose();
        } catch (err) {
            toast.error(err.message || "Payment processing failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div
                className="modal"
                style={{
                    maxWidth: "500px"
                }}
            >
                <h2
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "20px"
                    }}
                >
                    <FaCreditCard color="#10b981" />
                    Process Payment
                </h2>

                <div className="form-group">
                    <label>Invoice Number</label>

                    <input
                        type="text"
                        value={invoice.invoice}
                        disabled
                    />
                </div>

                <div
                    style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "20px"
                    }}
                >
                    <div
                        style={{
                            color: "#64748b",
                            fontSize: "14px",
                            marginBottom: "8px"
                        }}
                    >
                        Amount to be Charged
                    </div>

                    <div
                        style={{
                            fontSize: "34px",
                            fontWeight: "700",
                            color: "#10b981"
                        }}
                    >
                        ₹{Number(invoice.total_amount).toFixed(2)}
                    </div>
                </div>

                <div
                    style={{
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        borderRadius: "10px",
                        padding: "14px",
                        marginBottom: "25px",
                        color: "#1e3a8a",
                        fontSize: "14px",
                        lineHeight: "1.6"
                    }}
                >
                    This payment will be processed using the <strong>Mock Payment Gateway</strong>.
                    <br />
                    The backend will simulate a payment response and automatically
                    update the invoice, payment and subscription status.
                </div>

                <div
                    className="modal-actions"
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px"
                    }}
                >
                    <button
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="primary-btn"
                        onClick={handleProcessPayment}
                        disabled={loading}
                        style={{
                            backgroundColor: "#10b981"
                        }}
                    >
                        {loading
                            ? "Processing..."
                            : "Process Payment"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProcessPaymentModal;