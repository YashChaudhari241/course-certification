import Image from "next/image";
import { useState } from "react";
import { Inter } from "next/font/google";
import prisma from "../lib/prisma";
import Navbar from "@/components/Navbar/Navbar";
const inter = Inter({ subsets: ["latin"] });
import { useAccount } from "wagmi";
import { useEffect } from "react";
const getServerSideProps = async (address) => {
  const feed = await prisma.user.findMany({
    // where: { issuedTo: address },
    include: {
      issuedTo: {
        select: { name: true },
      },
    },
  });

  return {
    props: { feed },

    revalidate: 10,
  };
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const [certs, setCerts] = useState(null);

  return (
    <div>
      <Navbar />
    </div>
  );
}
