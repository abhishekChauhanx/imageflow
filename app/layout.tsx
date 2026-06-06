import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";
import ReduxProvider from "@/components/ReduxProvider/ReduxProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

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

  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  );
}