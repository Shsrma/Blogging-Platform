import '../styles/ConfirmationDialog.css'

function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  if (!isOpen) return null

  return (
    <div className="confirmation-overlay" onClick={onClose}>
      <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirmation-title">{title}</h3>
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-actions">
          <button onClick={onClose} className="btn btn-secondary">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog
