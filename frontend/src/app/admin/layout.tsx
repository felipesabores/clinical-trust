import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
    title: "Vivid Stream Pet | Admin",
    description: "Painel administrativo do Pet Shop",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-background min-h-screen text-foreground">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen flex flex-col relative">
                <Header />
                <div className="flex-1 p-6 overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}
