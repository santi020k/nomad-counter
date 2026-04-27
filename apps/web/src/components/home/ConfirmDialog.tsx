import { useEffect, useRef } from 'react'
import styles from './ConfirmDialog.module.css'

interface Props {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, description, confirmLabel = 'Remove', onConfirm, onCancel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleClose = () => { onCancel() }
    dialog.addEventListener('close', handleClose)
    return () => { dialog.removeEventListener('close', handleClose) }
  }, [onCancel])

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="confirm-dialog-title">
      <div className={styles.box}>
        <h2 id="confirm-dialog-title">{title}</h2>
        <p className={`muted ${styles.desc}`}>{description}</p>
        <div className={styles.actions}>
          <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>
          <button
            type="button"
            className="btn danger"
            aria-describedby="confirm-dialog-title"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
