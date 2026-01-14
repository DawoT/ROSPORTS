import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Project Iron-Clad",
    description: "Next.js 15 Enterprise Scaffold",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>): React.JSX.Element {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
