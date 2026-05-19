"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { useAuthStore } from "@/store/auth";
import { useUiStore } from "@/store/ui";

const navItems = [
    { href: "/", label: "Home", activePaths: ["/"] },
    { href: "/projects", label: "Projects", activePaths: ["/projects"] },
    { href: "/blogs", label: "Blog", activePaths: ["/blogs", "/blog"] },
    { href: "/about", label: "About", activePaths: ["/about"] }
];

export function Navigation() {
    const pathname = usePathname();
    const { user, role } = useAuthStore();
    const openAuthModal = useUiStore((state) => state.openAuthModal);

    const isActive = (item: (typeof navItems)[number]) => {
        return item.activePaths.some((path) => {
            if (path === "/") {
                return pathname === "/";
            }

            return pathname === path || pathname.startsWith(`${path}/`);
        });
    };

    return (
        <nav className="mx-auto flex max-w-[900px] flex-wrap items-center justify-between gap-4 px-5 py-5">
            <Link href="/" className="text-sm font-semibold tracking-wide text-ink">
                Kamal Singh
            </Link>
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`transition-colors ${isActive(item)
                            ? "text-ink border-b-2 border-ink pb-1"
                            : "hover:text-ink border-b-2 border-transparent pb-1"
                            }`}
                    >
                        {item.label}
                    </Link>
                ))}
                {user ? (
                    <ProfileDropdown />
                ) : (
                    <Button
                        onClick={() => openAuthModal("Login to like posts and join the discussion.")}
                        className="min-h-9 px-3 py-1.5"
                    >
                        Login
                    </Button>
                )}
            </div>
        </nav>
    );
}
