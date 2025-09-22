import React from "react";
import "../../styles/shared/buttons.css";

export default function EJButton({
  as: Tag = "button",
  variant = "approve", // "approve" | "danger" | "primary"
  className = "",
  children,
  ...props
}) {
  const variantClass =
    variant === "danger" ? "ej-danger" :
    variant === "primary" ? "ej-primary" :
    "ej-approve";
  const cls = `ej-btn ${variantClass} ${className}`.trim();
  return <Tag className={cls} {...props}>{children}</Tag>;
}
