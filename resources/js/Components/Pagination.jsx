import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (!links || links.length <= 1) return null;

    return (
        <div className="flex justify-center p-4 border-t border-default dark:border-gray-700">
            <nav aria-label="Page navigation">
                <ul className="flex -space-x-px text-sm">
                    {links.map((link, i) => {
                        const isEllipsis =
                            link.label.includes("…") || link.label === "...";
                        const isPrev = link.label.includes("Previous");
                        const isNext = link.label.includes("Next");

                        // Base classes for normal button
                        let itemClasses =
                            "flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm px-3 h-10 focus:outline-none";

                        // Active page (current)
                        if (link.active) {
                            itemClasses =
                                "flex items-center justify-center text-fg-brand bg-neutral-tertiary-medium box-border border border-default-medium hover:text-fg-brand font-medium text-sm w-10 h-10 focus:outline-none";
                        }
                        // Non‑active number buttons (fixed width)
                        else if (!isPrev && !isNext && !isEllipsis) {
                            itemClasses =
                                "flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm w-10 h-10 focus:outline-none";
                        }
                        // Previous / Next (with padding)
                        else if (isPrev || isNext) {
                            itemClasses =
                                "flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm px-3 h-10 focus:outline-none";
                        }
                        // Ellipsis (disabled)
                        else if (isEllipsis) {
                            itemClasses =
                                "flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium font-medium text-sm w-10 h-10 cursor-default opacity-50";
                        }

                        // Rounded corners on first & last items
                        if (i === 0) itemClasses += " rounded-s-base";
                        if (i === links.length - 1)
                            itemClasses += " rounded-e-base";

                        // Remove rounding from active page if it's also the first or last
                        if (link.active && i === 0)
                            itemClasses = itemClasses.replace(
                                "rounded-s-base",
                                "",
                            );
                        if (link.active && i === links.length - 1)
                            itemClasses = itemClasses.replace(
                                "rounded-e-base",
                                "",
                            );

                        // For Prev/Next that are not at the very edges (because of an ellipsis)
                        if (isPrev && i !== 0)
                            itemClasses = itemClasses.replace(
                                "rounded-s-base",
                                "",
                            );
                        if (isNext && i !== links.length - 1)
                            itemClasses = itemClasses.replace(
                                "rounded-e-base",
                                "",
                            );

                        return (
                            <li key={i}>
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        className={itemClasses}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        className={itemClasses}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
