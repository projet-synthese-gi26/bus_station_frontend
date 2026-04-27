"use client";

import { JSX } from "react";
import Link from "next/link";
import { useSidebarLink } from "@/lib/hooks/sidebar-hooks/useSidebarLink";
import LinkContent from "@/components/layouts/customer-sibebar/LinkContent";
import { LinkItem } from "@/components/layouts/customer-sibebar/clientNavLink";

export type RenderLinkProps = {
    linkItem: LinkItem;
    isSubLink?: boolean;
    onSidebarClose: () => void;
}

export function RenderLink({ linkItem, isSubLink = false, onSidebarClose }: RenderLinkProps): JSX.Element {


    const { isActive, hasSubLinks, isExpanded, Icon, toggleSubMenu } = useSidebarLink(linkItem);

    return (
        <div className="mb-1">
            {hasSubLinks ? (
                <button
                    className="w-full text-left cursor-pointer"
                    onClick={() => toggleSubMenu(linkItem.name)}
                >
                    <LinkContent
                        Icon={Icon}
                        isActive={isActive}
                        linkItem={linkItem}
                        isSubLink={isSubLink}
                        isExpanded={isExpanded}
                        hasSubLinks={hasSubLinks}
                    />
                </button>
            ) : (
                <Link
                    href={linkItem?.link || "#"}
                    onClick={onSidebarClose}
                    className="block cursor-pointer"
                >
                    <LinkContent
                        Icon={Icon}
                        isActive={isActive}
                        linkItem={linkItem}
                        isSubLink={isSubLink}
                        isExpanded={isExpanded}
                        hasSubLinks={false}
                    />
                </Link>
            )}

            {/* Sous-liens */}
            {hasSubLinks && isExpanded && (
                <div className="mt-2 space-y-1 overflow-hidden animate-slideDown">
                    {linkItem.subLinks?.map((subItem, subIndex) => (
                        <RenderLink
                            key={subIndex}
                            linkItem={subItem}
                            isSubLink={true}
                            onSidebarClose={onSidebarClose}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}