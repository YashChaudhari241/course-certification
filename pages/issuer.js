import Navbar from "@/components/Navbar/Navbar";
import Nossr from "@/components/Nossr";
import { useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";

import UserSelect from "@/components/UserSelect";
import certifyConfig from "../../course-certification-hardhat/artifacts/contracts/Certify.sol/Certify.json";
import contractAddress from "../hardhat.json";
import prisma from "../lib/prisma";
export async function getServerSideProps(context) {
  const feed = await prisma.user.findMany({
    // where: { : true },
    select: {
      name: true,
      id: true,
    },
  });

  return {
    props: { feed: JSON.parse(JSON.stringify(feed)) },
  };
}
export default (props) => {
  const [id, setID] = useState(null);
  const [formData, setForm] = useState({});
  const { address } = useAccount();
  const handleChange = (e, i) => {
    setForm({ ...formData, [i]: e.target.value });
    console.log(formData);
  };
  const [showmodal, setModal] = useState(false);
  const { data: signer, isError, isLoading } = useSigner();
  const contract = useContract({
    address: contractAddress.deployed_at,
    abi: certifyConfig.abi,
    signerOrProvider: signer,
  });
  const handleIssue = async () => {
    const result = await fetch("http://localhost:3000/api/issue", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        id: id,
        walletAddress: address,
      }),
      mode: "same-origin",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const body = await result.json();
    console.log(body);
    const transactionRes = await contract.issueCertificate({
      issuedTo: body.wallet,
      issuedBy: address,
      id: body.id.id,
      issuedAt: Date.now(),
      encryptedData: body.enc,
    });
    const r = await transactionRes.wait(1);
    console.log(r);
    alert("Issued Successfully");
  };
  return (
    <div>
      <Nossr>
        <Navbar></Navbar>
      </Nossr>
      <div className="mt-40 border rounded-lg flex flex-col w-2/5 space-y-4 mx-auto px-4 py-12 text-center items-center justify-center">
        <h3 className="font-bold text-4xl"> Issue Certificate</h3>
        <div className="inline">
          <p className="inline">Course:</p>
          <input
            className="inline bg-slate-50 border rouned-lg h-10"
            type="email"
            onChange={(e) => handleChange(e, "course")}
          ></input>
        </div>
        <div className="inline">
          <p className="inline">Grade(Optional):</p>
          <input
            className="inline bg-slate-50 border rouned-lg h-10"
            onChange={(e) => handleChange(e, "grade")}
          ></input>
        </div>
        {id !== null && <p>Selected Student ID: {id}</p>}
        <button onClick={() => setModal(true)}>Select Student</button>
        {showmodal && (
          <UserSelect
            feed={props.feed}
            setID={(e) => {
              setID(e);
              console.log(e);
              setModal(false);
            }}
          />
        )}
        <div className="inline">
          <Nossr>
            <p className="inline">Issuing Wallet Address: </p>
            {address}
          </Nossr>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-800 font-semibold rounded-md text-white px-4 py-2 border"
          onClick={handleIssue}
        >
          Issue
        </button>
      </div>
    </div>
  );
};
