import { useState } from "react";
import { Inter } from "next/font/google";
import prisma from "../../lib/prisma";
import Navbar from "@/components/Navbar/Navbar";
import { enc } from "crypto-js";
const inter = Inter({ subsets: ["latin"] });
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AES } from "crypto-js";
import { useAccount, useContract, useSigner } from "wagmi";
import certifyConfig from "../../../course-certification-hardhat/artifacts/contracts/Certify.sol/Certify.json";
import contractAddress from "../../hardhat.json";
export async function getServerSideProps(context) {
  const { id } = context.query;
  const feed = await prisma.certificate.findFirst({
    where: {
      id: id,
    },
    include: {
      issuedTo: { select: { name: true, walletAddress: true } },
    },
  });
  return {
    props: { feed: JSON.parse(JSON.stringify(feed)) },
  };
}

export default (props) => {
  const router = useRouter();
  const { key } = router.query;
  const { data: signer, isError, isLoading } = useSigner();
  const contract = useContract({
    address: contractAddress.deployed_at,
    abi: certifyConfig.abi,
    signerOrProvider: signer,
  });

  const handleVerify = async () => {
    const transactionRes = await contract.getAllCertificates(
      props.feed.issuedTo.walletAddress
    );
    console.log(transactionRes);
    for (let x = 0; x < transactionRes.length; x++) {
      if (transactionRes[x].id == props.feed.id) {
        var bytes = AES.decrypt(transactionRes[x].encryptedData, key);
        var originalText = bytes.toString(enc.Utf8);
        setBlockdata({ ...transactionRes, dec: originalText });
        var fields = originalText.split("##");
        const field = [" Issued To: ", " Course: ", " grade: ", " Issued by: "];
        var finals = "";
        for (var j = 0; j < fields.length; j++) {
          finals = finals + field[j] + fields[j];
        }
        alert(finals);
        break;
      }
    }
  };
  const [blockData, setBlockdata] = useState(null);
  return (
    <div>
      <Navbar />
      <div className="mt-20">
        {props.feed == null && <p>Invalid Link</p>}
        {props.feed !== null && (
          <div className="border shadow-md rounded-lg p-3 flex flex-col space-y-2 items-center">
            <h3 className="text-4xl inline font-bold">Certificate</h3>
            <div className="text-3xl inline">
              <p className="inline">Name: </p>
              <p className="text-blue-500 inline">{props.feed.issuedTo.name}</p>
            </div>
            <div className="text-2xl flex w-full items-center justify-evenly">
              <div>
                <p className="inline">Issued by: </p>
                <p className="text-slate-500 inline">{props.feed.issuedBy}</p>
              </div>
              <div className="text-2xl inline">
                <p className="inline">IssuedAt: </p>
                <p className="text-slate-500 inline">{props.feed.issuedAt}</p>
              </div>
            </div>
            <div className="text-2xl inline">
              <p className="inline">Grade: </p>
              <p className="text-blue-500 inline">
                {props.feed.grade !== undefined ? +props.feed.grade : "NA"}
              </p>
            </div>
            <div className="text-xs inline">
              <p className="inline">ID: </p>
              <p className="text-slate-500 inline">{props.feed.id}</p>
            </div>
            <button onClick={handleVerify}>Verify</button>
          </div>
        )}
      </div>
    </div>
  );
};
