import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";
import ReduxProvider from "@/components/ReduxProvider/ReduxProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
export const metadata: Metadata = {
  title: "ImageFlow",
  description: "Describe any image, find it across the web",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
 const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang="en">
      <body>
                <NextIntlClientProvider locale={locale} messages={messages}>

        <ReduxProvider>
          <SessionProvider session={session}>
            <Toaster
              position="top-center"
              toastOptions={{
                success: {
                  style: {
                    background: "#18181b",
                    color: "#fff",
                    border: "1px solid #27272a",
                  },
                  iconTheme: {
                    primary: "#22c55e",
                    secondary: "#fff",
                  },
                },
              }}
            />
            {children}
          </SessionProvider>
        </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}