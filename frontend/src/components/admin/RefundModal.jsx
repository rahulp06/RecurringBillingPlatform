import { useState, useEffect } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { processRefund } from "../../services/api";

function RefundModal({
    open,
    payment,
    onClose,
    onSuccess
}) {

    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (payment) {

            setAmount(
                payment.amount_raw - (payment.refunded_amount || 0) ??
                Number(
                    String(payment.amount)
                        .replace(/[^\d.]/g, "")
                )
            );

            setReason("");

        }

    }, [payment]);

    if (!open || !payment) return null;

    const paidAmount =
        payment.amount_raw ??
        Number(
            String(payment.amount)
                .replace(/[^\d.]/g, "")
        );

    const handleRefund = async () => {

        if (!amount || Number(amount) <= 0) {

            alert("Enter a valid refund amount.");

            return;

        }

        if (Number(amount) > paidAmount) {

            alert("Refund amount cannot exceed the paid amount.");

            return;

        }

        if (!reason.trim()) {

            alert("Please enter a refund reason.");

            return;

        }

        try {

            setLoading(true);

            const result = await processRefund(
                payment.id,
                Number(amount),
                reason
            );

            alert(
                

            `✅ Refund Processed Successfully

            Refund Amount : ₹${amount}

            Total Refunded : ₹${result.refunded_amount}

            Refund Status : ${result.refund_status}`

            );
            

            onSuccess?.();

            onClose();

        }

        catch (err) {

            alert(err.message || "Refund failed.");

        }

        finally {

            setLoading(false);

        }

    };

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
                    <FaMoneyBillWave
                        style={{
                            color: "#16a34a",
                            fontSize: "28px"
                        }}
                    />

                    Refund Payment

                </h2>

                <div className="form-group">

                    <label>
                        Invoice Number
                    </label>

                    <input
                        value={payment.invoice}
                        readOnly
                    />

                </div>

                <div className="form-group">

                    <label>
                        Customer
                    </label>

                    <input
                        value={payment.customer}
                        readOnly
                    />

                </div>

                <div className="form-group">

                    <label>
                        Paid Amount
                        <div className="refund-summary">

                            <div>

                                <span>Already Refunded</span>

                                <strong>
                                    ₹{Number(payment.refunded_amount || 0).toFixed(2)}
                                </strong>

                            </div>

                            <div>

                                <span>Remaining Refundable</span>

                                <strong className="remaining">

                                    ₹{(
                                        payment.amount_raw -
                                        (payment.refunded_amount || 0)
                                    ).toFixed(2)}

                                </strong>

                            </div>

                        </div>
                    </label>

                    <input
                        value={`₹${paidAmount.toFixed(2)}`}
                        readOnly
                    />

                </div>

                <div className="form-group">

                    <label>
                        Refund Amount
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max={paidAmount}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                </div>

                <div className="form-group">

                    <label>
                        Refund Reason
                    </label>

                    <textarea
                        rows={4}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter refund reason..."
                    />

                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "15px",
                        marginTop: "25px"
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
                        onClick={handleRefund}
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : "Issue Refund"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default RefundModal;