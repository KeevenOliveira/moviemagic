import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

import Header from "@/components/Header";

import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <Header />
      <Component {...pageProps} />
      <ToastContainer />
    </main>
  );
}
