import "../../styles/common/confirmation-modal.css";

function ConfirmationModal({
    open,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    onConfirm,
    onClose,
}) {

    if (!open) return null;

    return (

        <div className="confirmation-overlay">

            <div className="confirmation-modal">

                <h2>{title}</h2>

                <p>{description}</p>

                <div className="confirmation-actions">

                    <button
                        className="secondary-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>

                    <button
                        className="primary-btn"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : confirmText}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default ConfirmationModal;