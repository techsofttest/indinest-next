import React from "react";
import Link from "next/link";

interface BaseButtonProps {
  variant?: "primary" | "secondary" | "tertiary" | "white";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

// Props when rendered as a button
type ButtonAsButtonProps = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

// Props when rendered as a link
type ButtonAsLinkProps = BaseButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 ease-in-out whitespace-nowrap focus:outline-none";

  const variantStyles = {
    primary: "bg-[#010526] text-white border border-[#010526] hover:bg-[#010526]/90",
    secondary: "border border-[#010526] text-[#010526] hover:bg-[#010526] hover:text-white bg-transparent",
    tertiary: "text-[#010526] hover:opacity-70 bg-transparent border-none p-0",
    white: "border border-white text-white hover:bg-white hover:text-[#010526] bg-transparent",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-[10px] tracking-widest",
    md: "px-6 py-3 text-[10px] tracking-widest",
    lg: "px-10 py-4 text-xs tracking-widest",
  };

  // If tertiary, size padding shouldn't apply standard padding to allow custom placement
  const appliedSizeStyles = variant === "tertiary" ? "text-[10px]" : sizeStyles[size];
  const widthStyles = fullWidth ? "w-full" : "";

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="mr-2 flex items-center">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="ml-2 flex items-center">{icon}</span>}
    </>
  );

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${appliedSizeStyles} ${widthStyles} ${className}`.trim();

  if (props.href !== undefined) {
    const { href, ...linkProps } = props as ButtonAsLinkProps;
    return (
      <Link href={href} className={combinedClassName} {...linkProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButtonProps;
  return (
    <button className={combinedClassName} {...buttonProps}>
      {content}
    </button>
  );
}
