import type { ReactNode } from "react";

type StateVariant = "info" | "empty" | "error" | "warning";

type StateMessageProps = {
  variant: StateVariant;
  children: ReactNode;
};

const variantClassByType: Record<StateVariant, string> = {
  info: "state-card--info",
  empty: "state-card--empty",
  error: "state-card--error",
  warning: "state-card--warning"
};

export function StateMessage({ variant, children }: StateMessageProps) {
  const isAlert = variant === "error" || variant === "warning";

  return (
    <div
      className={`state-card ${variantClassByType[variant]}`}
      role={isAlert ? "alert" : "status"}
      aria-live={isAlert ? "assertive" : "polite"}
    >
      {children}
    </div>
  );
}
