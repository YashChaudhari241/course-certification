import Navbar from "@/components/Navbar/Navbar";
import { useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";
import certifyConfig from "../../course-certification-hardhat/artifacts/contracts/Certify.sol/Certify.json";
import contractAddress from "../hardhat.json";

export default () => {
  const { address } = useAccount();
  const { data: signer, isError, isLoading } = useSigner();
  const contract = useContract({
    address: contractAddress.deployed_at,
    abi: certifyConfig.abi,
    signerOrProvider: signer,
  });

  const handleCheck = async () => {
    const transactionRes = await contract.getAuthorityStatus();
    if (transactionRes == 1) {
      alert("Your wallet is authorized to add new issuers");
    } else {
      alert("Your wallet is unauthorized to add new issuers");
    }
  };

  const handleAdd = async () => {
    const transactionRes = await contract.addIssuer(inputA);
    const r = await transactionRes.wait(1);
    console.log(r);
    alert("transaction successful");
  };

  const [inputA, setInputA] = useState("");
  return (
    <div>
      <Navbar />
      <div className="mt-40"></div>
      <button onClick={handleCheck}>Check Authority Rights</button>
      <input
        placeholder="New Issuer Address"
        onChange={(e) => setInputA(e.target.value)}
      ></input>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};
