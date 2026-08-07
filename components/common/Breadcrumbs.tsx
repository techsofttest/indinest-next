import Link from "next/link";

export interface Crumb {
    label: string;
    href?: string; // omit for the active (last) crumb
}

interface BreadcrumbsProps {
    crumbs: Crumb[];
    className?: string;
}

const ChevronIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

/**
 * Generic breadcrumb — same visual language as ProductBreadcrumbs.
 * Accepts an array of crumbs; the last crumb is treated as the active page.
 */
export default function Breadcrumbs({ crumbs, className = "" }: BreadcrumbsProps) {
    return (
        <div className={`px-6 md:px-16 pt-3 pb-1 ${className}`}>
            <nav className="flex items-center gap-2 text-xs md:text-sm font-medium text-[#010526]/50">
                {crumbs.map((crumb, idx) => {
                    const isLast = idx === crumbs.length - 1;
                    return (
                        <span key={idx} className="flex items-center gap-2">
                            {idx > 0 && <ChevronIcon />}
                            {isLast || !crumb.href ? (
                                <span className={`truncate ${isLast ? "text-[#010526] font-bold" : ""}`}>
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="hover:text-[#010526] transition-colors capitalize"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </span>
                    );
                })}
            </nav>
        </div>
    );
}
