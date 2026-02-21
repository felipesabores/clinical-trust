import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { TenantProvider } from "@/context/TenantContext";
import { ThemeProvider } from "@/context/ThemeContext";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Clinical Trust SaaS",
    description: "Gestão e streaming ao vivo para pet boutiques",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br" suppressHydrationWarning>
            <body className={jakarta.className}>
                <ThemeProvider>
                    <TenantProvider>
                        {children}
                    </TenantProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
