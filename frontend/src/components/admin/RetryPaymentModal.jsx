import { FaRedoAlt, FaExclamationTriangle } from "react-icons/fa";
import { retryPayment } from "../../services/api";

function RetryPaymentModal({
    open,
    payment,
    onClose,
    onSuccess
}) {

    if (!open || !payment) return null;

    const handleRetry = async () => {
        try {

            await retryPayment(payment.id);

            alert(
                "✅ Payment retried successfully.\n\n" +
                "The payment has been processed through the Mock Payment Gateway.\n" +
                "The payment, invoice and subscription status have been updated."
            );

            onSuccess?.();

            onClose();

        } catch (err) {

            alert(
                `❌ ${err.message || "Retry failed."}\n\nPlease try again later.`
            );

        }
    };

    const attempts = payment.retry_count ?? 0;

    return (
        <div className="modal-overlay">

            <div className="modal">

                <h2
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}
                >
                    <FaRedoAlt
                        style={{
                            color: "#2563eb"
                        }}
                    />

                    Retry Failed Payment
                </h2>

                <div
                    style={{
                        background: "#fff8e6",
                        border: "1px solid #fde68a",
                        color: "#92400e",
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "25px",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start"
                    }}
                >
                    <FaExclamationTriangle
                        style={{
                            marginTop: "3px"
                        }}
                    />

                    <div>

                        <strong>
                            Previous payment was unsuccessful.
                        </strong>

                        <br />

                        Retrying will securely process this payment again through the Mock Payment Gateway.

                    </div>

                </div>

                <div className="form-group">

                    <label>
                        Invoice Number
                    </label>

                    <input
                        value={payment.invoice || payment.invoice?.invoice_number || ""}
                        readOnly
                    />

                </div>

                <div className="form-group">

                    <label>
                        Customer
                    </label>

                    <input
                        value={payment.customer || ""}
                        readOnly
                    />

                </div>

                <div className="form-group">

                    <label>
                        Amount
                    </label>

                    <input
                        value={
                            payment.amount
                                ? payment.amount
                                : `₹${Number(payment.amount_raw || 0).toFixed(2)}`
                        }
                        readOnly
                    />

                </div>

                <div className="form-group">

                    <label>
                        Failure Reason
                    </label>

                    <input
                        style={{
                            color: "#dc2626",
                            fontWeight: "600"
                        }}
                        value={
                            payment.failure_reason ||
                            "Mock Gateway Failure"
                        }
                        readOnly
                    />

                </div>

                <div className="form-group">

                    <label>
                        Retry Attempt
                    </label>

                    <input
                        value={`Attempt ${attempts} of 3`}
                        readOnly
                    />

                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "15px",
                        marginTop: "30px"
                    }}
                >

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="primary-btn"
                        onClick={handleRetry}
                        disabled={attempts >= 3}
                    >
                        <FaRedoAlt
                            style={{
                                color:"#2563eb",
                                fontSize:"30px"
                            }}
                        />

                        {attempts >= 3
                        ? "Maximum Retries Reached"
                        : "Retry Payment"}

                    </button>

                </div>

            </div>

        </div>
    );
}

export default RetryPaymentModal;