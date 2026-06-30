import Link from "next/link";
import type { ActivityType } from "@/types";

export const TYPE_ICON: Record<ActivityType, string> = {
  flight: "✈️",
  hotel: "🏨",
  rail: "🚂",
  car: "🚗",
  activity: "🥾",
  dining: "🍽️",
  transfer: "🚐",
};

export const TYPE_LABEL: Record<ActivityType, string> = {
  flight: "Flight",
  hotel: "Stay",
  rail: "Rail",
  car: "Car hire",
  activity: "Activity",
  dining: "Dining",
  transfer: "Transfer",
};

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
      {children}
    </div>
  );
}

export function NoHiddenFees({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg border border-green-border bg-green-light px-3.5 py-3 ${className}`}
    >
      <span className="mt-0.5 shrink-0 text-base leading-none text-secondary">✓</span>
      <p className="text-[11px] font-semibold leading-relaxed text-[#3a6b67]">
        No hidden fees — this is the only Voyager charge. Every flight, hotel and
        activity is booked at its standard published price. No markup, no commission.
      </p>
    </div>
  );
}

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  full?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
};

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent text-white hover:bg-accent-dark shadow-sm",
  secondary: "bg-surface text-accent border-[1.5px] border-accent hover:bg-accent-light",
  ghost: "bg-transparent text-text-mid border border-border hover:bg-surface-alt",
  danger: "bg-danger-light text-danger border border-danger-border hover:brightness-95",
};

export function Button({
  children,
  onClick,
  href,
  variant = "primary",
  full,
  disabled,
  className = "",
  type = "button",
}: ButtonProps) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-[13px] font-bold transition-all disabled:opacity-50 disabled:cursor-default ${
    VARIANTS[variant]
  } ${full ? "w-full" : ""} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function Chip({
  children,
  active,
  onClick,
  tone = "neutral",
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  tone?: "neutral" | "accent";
}) {
  const base =
    "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-colors";
  const styles = active
    ? "bg-accent-light text-accent border-[1.5px] border-accent"
    : tone === "accent"
      ? "bg-accent-light text-accent border border-[#7F543D55]"
      : "bg-tag text-text-mid border-[1.5px] border-transparent hover:border-border";
  return (
    <button onClick={onClick} className={`${base} ${styles}`} type="button">
      {children}
    </button>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div
      className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
        light ? "text-[#caa68f]" : "text-accent"
      }`}
    >
      Voyager
    </div>
  );
}
