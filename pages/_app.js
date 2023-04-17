import "@/styles/globals.css";
import { WagmiConfig, createClient } from "wagmi";
import { client } from "../wagmi";
import { Inter } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </WagmiConfig>
  );
}
