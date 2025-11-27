import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { getSharedMetadata } from "../_helpers/helpers";
import { Toaster } from "sonner";
import { routing } from "@/i18n/routing";
import Navbar from "../_components/_website/_navbar/Navbar";
import ClientLayout from "../_components/_website/ClientLayout";
import ReduxProvider from "../_components/_website/_global/ReduxProvider";
import CartSide from "../_components/_website/_global/_cart/CartSide";
import Footer from "../_components/_website/_global/Footer";
import ".././globals.css";
import FetchData from "../_helpers/FetchData";

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
    describtion: t("description"),
    ...sharedMetadata,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "en" | "ar" }>;
}) {
  const { locale } = await params;
  const user = await FetchData(`/current-user`, false);

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <NextIntlClientProvider>
            <ClientLayout>
              <Toaster position="top-center" richColors closeButton />
              <Navbar locale={locale} user={user ?? null} />
              <CartSide />
              {children}
              <Footer />
            </ClientLayout>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
