"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";

export function ProfileDropdown() {
    const { user, role, signOut } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
    const email = user?.email;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    const handleSignOut = async () => {
        await signOut();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white hover:shadow-lg transition-shadow"
                title={displayName}
            >
                {displayName.charAt(0).toUpperCase()}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-200 bg-white shadow-lg z-50">
                    {/* User Info Section */}
                    <div className="border-b border-zinc-200 px-4 py-3">
                        <p className="text-sm font-semibold text-ink">{displayName}</p>
                        <p className="text-xs text-zinc-500 truncate">{email}</p>
                    </div>

                    {/* Buttons Section */}
                    <div className="space-y-2 p-3">
                        {role === "admin" && (
                            <Link
                                href="/admin/blog"
                                className="block"
                                onClick={() => setIsOpen(false)}
                            >
                                <Button className="w-full text-sm justify-center min-h-8 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded">
                                    Create Blog
                                </Button>
                            </Link>
                        )}
                        <button
                            onClick={handleSignOut}
                            className="w-full rounded px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 transition border border-zinc-200"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
