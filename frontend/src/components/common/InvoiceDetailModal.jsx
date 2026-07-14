import React from "react";
import "../../styles/admin/admin-modal.css"; // Reuse existing modal styles

function InvoiceDetailModal({
    open,
    onClose,
    invoice,
    customerName,
    customerEmail,
    customerCompany,
    planName,
    planInterval
}) {
    if (!open || !invoice) return null;

    const handlePrint = () => {
        window.print();
    };

    const printStyles = `
        @page {
            size: A4 portrait;
            margin: 15mm;
        }
        @media print {
            /* Reset body, html and all ancestor wrappers of the modal overlay */
            html, body, body *:has(.invoice-detail-modal-overlay) {
                position: static !important;
                overflow: visible !important;
                height: auto !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background: white !important;
                min-height: auto !important;
            }

            /* Hide everything that is not the modal overlay, its ancestor, or its descendant */
            body *:not(:has(.invoice-detail-modal-overlay)):not(.invoice-detail-modal-overlay):not(.invoice-detail-modal-overlay *) {
                display: none !important;
            }

            /* Style the overlay to act as the root document container */
            .invoice-detail-modal-overlay {
                position: static !important;
                display: block !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                backdrop-filter: none !important;
                box-shadow: none !important;
            }

            /* Size and center the invoice box to occupy standard printable width */
            .modal-content {
                margin: 0 auto !important;
                width: 100% !important;
                max-width: 180mm !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
                background: white !important;
                box-sizing: border-box !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }

            /* Hide interactive actions and close buttons */
            .invoice-detail-modal-actions, .close-detail-btn {
                display: none !important;
            }
        }
    `;

    return (
        <div className="modal-overlay invoice-detail-modal-overlay">
            <style>{printStyles}</style>
            <div className="modal modal-content" style={{ maxWidth: "600px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2>Invoice Details</h2>
                    <button className="close-detail-btn" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>&times;</button>
                </div>

                <div className="invoice-header-section" style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px", marginBottom: "20px" }}>
                    <div>
                        <h3 style={{ margin: 0, color: "#4f46e5" }}>BillingPro</h3>
                        <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#64748b" }}>Invoice #: {invoice.invoice_number || invoice.invoice}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <span className={`status ${String(invoice.status).toLowerCase()}`} style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>
                            {invoice.status}
                        </span>
                        <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#64748b" }}>Date: {invoice.invoice_date}</p>
                    </div>
                </div>

                <div className="invoice-details-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
                    <div>
                        <h4 style={{ margin: "0 0 8px 0", color: "#475569", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Billed To</h4>
                        <p style={{ margin: "2px 0", fontSize: "14px", fontWeight: "600" }}>{customerName}</p>
                        <p style={{ margin: "2px 0", fontSize: "13px", color: "#64748b" }}>{customerEmail}</p>
                        {customerCompany && <p style={{ margin: "2px 0", fontSize: "13px", color: "#64748b" }}>{customerCompany}</p>}
                    </div>
                    <div>
                        <h4 style={{ margin: "0 0 8px 0", color: "#475569", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Payment Details</h4>
                        <p style={{ margin: "2px 0", fontSize: "13px", color: "#64748b" }}>Due Date: <strong style={{ color: "#334155" }}>{invoice.due_date}</strong></p>
                    </div>
                </div>

                <div className="invoice-items-table" style={{ marginBottom: "25px" }}>
                    {invoice.is_proration ? (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #cbd5e1", textAlign: "left" }}>
                                    <th style={{ padding: "8px 0", color: "#475569", fontSize: "13px" }}>Adjustment Item</th>
                                    <th style={{ padding: "8px 0", textAlign: "right", color: "#475569", fontSize: "13px" }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                                    <td style={{ padding: "12px 0", fontSize: "14px", fontWeight: "500" }}>{invoice.proration_credit_label || "Unused Plan Credit"}</td>
                                    <td style={{ padding: "12px 0", textAlign: "right", fontSize: "14px", fontWeight: "600", color: "#16a34a" }}>-₹{Math.abs(invoice.proration_credit_amount || 0).toFixed(2)}</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                                    <td style={{ padding: "12px 0", fontSize: "14px", fontWeight: "500" }}>{invoice.proration_charge_label || "New Plan Charge"}</td>
                                    <td style={{ padding: "12px 0", textAlign: "right", fontSize: "14px", fontWeight: "600", color: "#d97706" }}>+₹{Math.abs(invoice.proration_charge_amount || 0).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #cbd5e1", textAlign: "left" }}>
                                    <th style={{ padding: "8px 0", color: "#475569", fontSize: "13px" }}>Plan Item</th>
                                    <th style={{ padding: "8px 0", color: "#475569", fontSize: "13px" }}>Interval</th>
                                    <th style={{ padding: "8px 0", textAlign: "right", color: "#475569", fontSize: "13px" }}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                                    <td style={{ padding: "12px 0", fontSize: "14px", fontWeight: "500" }}>{planName || "Subscription Plan"}</td>
                                    <td style={{ padding: "12px 0", fontSize: "14px", color: "#64748b" }}>{planInterval || "Monthly"}</td>
                                    <td style={{ padding: "12px 0", textAlign: "right", fontSize: "14px", fontWeight: "600" }}>₹{Number(invoice.subtotal || 0).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="invoice-summary-section" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", borderTop: "1px solid #e2e8f0", paddingTop: "15px", marginBottom: "20px" }}>
                    {invoice.is_proration ? (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "250px", fontSize: "14px", margin: "3px 0" }}>
                                <span style={{ color: "#64748b" }}>New Plan Charge:</span>
                                <span style={{ fontWeight: "500" }}>₹{Math.abs(invoice.proration_charge_amount || 0).toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "250px", fontSize: "14px", margin: "3px 0" }}>
                                <span style={{ color: "#64748b" }}>Unused Plan Credit:</span>
                                <span style={{ fontWeight: "500", color: "#16a34a" }}>-₹{Math.abs(invoice.proration_credit_amount || 0).toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "250px", fontSize: "16px", fontWeight: "bold", margin: "8px 0 0 0", paddingTop: "8px", borderTop: "1px solid #cbd5e1" }}>
                                <span>{invoice.total_amount < 0 ? "Credit Applied:" : "Amount Due:"}</span>
                                <span style={{ color: invoice.total_amount < 0 ? "#16a34a" : "#4f46e5" }}>
                                    ₹{Math.abs(invoice.total_amount || 0).toFixed(2)}
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "200px", fontSize: "14px", margin: "3px 0" }}>
                                <span style={{ color: "#64748b" }}>Subtotal:</span>
                                <span style={{ fontWeight: "500" }}>₹{Number(invoice.subtotal || 0).toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "200px", fontSize: "14px", margin: "3px 0" }}>
                                <span style={{ color: "#64748b" }}>Tax Amount:</span>
                                <span style={{ fontWeight: "500" }}>₹{Number(invoice.tax_amount || 0).toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "200px", fontSize: "16px", fontWeight: "bold", margin: "8px 0 0 0", paddingTop: "8px", borderTop: "1px solid #cbd5e1" }}>
                                <span>{invoice.total_amount < 0 ? "Credit Applied" : "Total"}:</span>
                                <span style={{ color: invoice.total_amount < 0 ? "#16a34a" : "#4f46e5" }}>
                                    ₹{Math.abs(invoice.total_amount || 0).toFixed(2)}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-actions invoice-detail-modal-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                    <button className="cancel-btn" onClick={onClose}>Close</button>
                    <button className="primary-btn" onClick={handlePrint}>Download PDF / Print</button>
                </div>
            </div>
        </div>
    );
}

export default InvoiceDetailModal;
