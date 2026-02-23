'use client';

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-background min-h-screen text-foreground relative">
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className={cn(
                "flex-1 min-h-screen flex flex-col relative min-w-0 transition-all duration-300",
                "lg:ml-64" // Margin only on desktop
            )}>
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="flex-1 p-4 sm:p-6 flex flex-col min-w-0 overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}
