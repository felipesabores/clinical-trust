import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";

import { TenantProvider } from "@/context/TenantContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const fontHeading = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dmsans",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Vivid Stream Pet | SaaS",
    description: "Gestão VIP e streaming ao vivo para pet boutiques",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br" suppressHydrationWarning className={`${inter.variable} ${fontHeading.variable} dark`}>
            <body className="font-sans antialiased bg-background text-foreground">
                <ThemeProvider>
                    <TenantProvider>
                        {children}
                    </TenantProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
