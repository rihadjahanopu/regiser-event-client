/* eslint-disable @typescript-eslint/typedef */
import { Toaster } from "@/components/ui/sonner";
import UserInitializer from "@/components/UserInitializer";
import type { Metadata } from "next";
import {
	Geist_Mono,
	Great_Vibes,
	Outfit,
	Playfair_Display,
} from "next/font/google";
import "./globals.css";

const outfit = Outfit({
	variable: "--font-outfit",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const playfair = Playfair_Display({
	variable: "--font-playfair",
	subsets: ["latin"],
});

const greatVibes = Great_Vibes({
	variable: "--font-great-vibes",
	weight: "400",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Talamij — Empowering Youth & Community",
	description:
		"Talamij is a non-profit organization dedicated to youth talent development, leadership building, and social progress.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`dark ${outfit.variable} ${geistMono.variable} ${playfair.variable} ${greatVibes.variable} antialiased`}>
			<head>
				<link
					rel="preconnect"
					href="https://fonts.googleapis.com"
				/>
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body>
				<UserInitializer />
				{children}
				<Toaster
					richColors
					position="top-right"
				/>
			</body>
		</html>
	);
}
