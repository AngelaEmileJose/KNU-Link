"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import type { User as UserType } from "../app/types";

interface ProfileMenuProps {
    user: UserType;
}

export function ProfileMenu({ user }: ProfileMenuProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = () => {
        // Clear session
        localStorage.removeItem("user");
        // Redirect to login
        router.push("/");
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all p-2"
                title="Profile Menu"
            >
                {user?.icon ? (
                    <img src={user.icon} alt="Your mascot" className="w-full h-full object-contain" />
                ) : (
                    <User className="w-5 h-5 text-gray-600" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 bg-gradient-to-br from-red-50/40 to-amber-50/60 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-2">
                                {user.icon ? (
                                    <img src={user.icon} alt="Your mascot" className="w-full h-full object-contain" />
                                ) : (
                                    <User className="w-5 h-5 text-gray-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">{user.nickname}</h3>
                                <p className="text-xs text-gray-600">ID: {user.studentId}</p>
                                <p className="text-xs text-gray-500 capitalize">{user.gender}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
