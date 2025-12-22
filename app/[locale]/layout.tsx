import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { getSharedMetadata } from "../_helpers/helpers";
import { Toaster } from "sonner";
import Navbar from "../_components/_website/_navbar/Navbar";
import ClientLayout from "../_components/_website/ClientLayout";
import ReduxProvider from "../_components/_website/_global/ReduxProvider";
import CartSide from "../_components/_website/_global/_cart/CartSide";
import Footer from "../_components/_website/_global/Footer";
import FetchData from "../_helpers/FetchData";
import FacebookPixelHead from "../_components/_layout/FacebookPixelHead";
import TikTokPixelHead from "../_components/_layout/TikTokPixelHead";
import ".././globals.css";
import N8nChat from "../_components/_website/_N8nChat/N8nChat";
import ChatBtns from "../_components/_website/_global/ChatBtns";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const t = await getTranslations("metaLayoutContent");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    icons: {
      icon: "https://aram-gulf.com/favicon.ico",
      shortcut: "https://aram-gulf.com/logo-16x16.png",
      apple: "https://aram-gulf.com/apple-touch-icon.png",
    },
    ...sharedMetadata,
  };
}

export default async function RootLayout({ children, params }: any) {
  const { locale } = await params;
  const user = await FetchData(`/current-user`, false);

  return (
    <html lang={locale}>
      <head>
        <FacebookPixelHead />
        <TikTokPixelHead />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <NextIntlClientProvider>
            <ClientLayout>
              <Toaster position="top-center" richColors closeButton />
              <Navbar locale={locale} user={user ?? null} />
              <CartSide />
              <ChatBtns />
              {children}
              <Footer />
            </ClientLayout>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
