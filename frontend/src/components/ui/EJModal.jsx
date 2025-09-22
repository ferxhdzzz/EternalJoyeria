// frontendPriv/src/components/ui/EJModal.jsx
import React, { useEffect, useRef, useCallback } from "react";
import "../../styles/shared/modal.css";
import "../../styles/shared/buttons.css";

export default function EJModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  ariaLabel,
}) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("body--modal-open");
      const el =
        dialogRef.current?.querySelector("[data-autofocus]") ||
        dialogRef.current?.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      el?.focus();
    } else {
      document.body.classList.remove("body--modal-open");
    }
    return () => document.body.classList.remove("body--modal-open");
  }, [isOpen]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) onClose?.();
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="ej-modal-overlay"
      onMouseDown={handleOverlayClick}
      ref={overlayRef}
      role="presentation"
    >
      <div
        className="ej-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title ? undefined : ariaLabel}
        aria-labelledby={title ? "ej-modal-title" : undefined}
        ref={dialogRef}
      >
        {(title || onClose) && (
          <div className="ej-modal__header">
            {title && <h3 id="ej-modal-title" className="ej-modal__title">{title}</h3>}
            {onClose && (
              <button
                className="ej-modal__close ej-btn ej-danger ej-size-xs"
                onClick={onClose}
                aria-label="Cerrar"
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div className="ej-modal__content">{children}</div>

        {footer && <div className="ej-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
