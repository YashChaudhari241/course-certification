import Image from "next/image";
import { useState } from "react";
import { Inter } from "next/font/google";
import prisma from "../../lib/prisma";
import Navbar from "@/components/Navbar/Navbar";
const inter = Inter({ subsets: ["latin"] });
import { useRouter } from "next/router";
import { useEffect } from "react";
export async function getServerSideProps(context) {
  const { address } = context.query;
  const feed = await prisma.certificate.findMany({
    where: {
      issuedTo: {
        walletAddress: address,
      },
    },
    include: {
      issuedTo: { select: { name: true } },
    },
  });
  return {
    props: { feed: JSON.parse(JSON.stringify(feed)) },
  };
}

export default function Home(props) {
  const router = useRouter();
  const { pid } = router.query;
  return (
    <div>
      <Navbar />
      <div className="w-200 mx-20 mt-40">
        {props.feed.length == 0 && <p>No Certificates found</p>}
        {props.feed.map((e) => {
          console.log(e);
          return (
            <div className="border shadow-md rounded-lg p-3 flex flex-col space-y-2 items-center">
              <h3 className="text-4xl inline font-bold">Certificate</h3>
              <div className="text-3xl inline">
                <p className="inline">Name: </p>
                <p className="text-blue-500 inline">{e.issuedTo.name}</p>
              </div>
              <div className="text-2xl flex w-full items-center justify-evenly">
                <div>
                  <p className="inline">Issued by: </p>
                  <p className="text-slate-500 inline">{e.issuedBy}</p>
                </div>
                <div className="text-2xl inline">
                  <p className="inline">IssuedAt: </p>
                  <p className="text-slate-500 inline">{e.issuedAt}</p>
                </div>
              </div>
              <div className="text-2xl inline">
                <p className="inline">Grade: </p>
                <p className="text-blue-500 inline">
                  {e.grade !== undefined ? +e.grade : "NA"}
                </p>
              </div>
              <div className="text-xs inline">
                <p className="inline">Sharable Link: </p>
                <p className="text-slate-500 inline">
                  http://localhost:3000/certificate/{e.id}?key={e.decKey}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
