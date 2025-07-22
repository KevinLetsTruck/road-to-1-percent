import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Road to 1% - Transform Your Driving Career",
  description: "Join the Road to 1% program and unlock your full potential as a professional driver. Get personalized assessments, expert guidance, and join a community of high achievers.",
  keywords: "truck driver, professional driver, career development, financial assessment, driver training, trucking industry",
  authors: [{ name: "Road to 1%" }],
  creator: "Road to 1%",
  publisher: "Road to 1%",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://spiassessment.com'),
  openGraph: {
    title: "Road to 1% - Transform Your Driving Career",
    description: "Join the Road to 1% program and unlock your full potential as a professional driver.",
    url: 'https://spiassessment.com',
    siteName: 'Road to 1%',
    images: [],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Road to 1% - Transform Your Driving Career",
    description: "Join the Road to 1% program and unlock your full potential as a professional driver.",
    images: [],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
