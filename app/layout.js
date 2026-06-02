import { Sora } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata = {
  title: "TaskBoard",
  description: "A beautifully minimal task manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sora.className} style={{ margin: 0, padding: 0, background: "#0b0b0b" }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}