import type { AppProps } from "next/app";

import Header from "@/components/Header";

import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="mm-container pb-12">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
