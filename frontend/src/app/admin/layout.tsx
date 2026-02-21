import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
    title: "Clinical Trust Admin",
    description: "Painel administrativo do Pet Shop",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-background min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen">{children}</main>
        </div>
    );
}
