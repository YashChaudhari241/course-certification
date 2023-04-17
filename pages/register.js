import Navbar from "@/components/Navbar/Navbar";
import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import Nossr from "@/components/Nossr";
import { useCookies } from "react-cookie";
export default () => {
  const [formData, setForm] = useState({});
  const { address } = useAccount();
  const [cookies, setCookie, removeCookie] = useCookies(["access-token"]);
  const { signMessageAsync } = useSignMessage();
  const handleChange = (e, i) => {
    setForm({ ...formData, [i]: e.target.value });
    console.log(formData);
  };

  const handleRegister = async () => {
    fetch("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        walletAddress: address,
      }),
      mode: "same-origin",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then(async (data) => {
        console.log(data);
        const signature = await signMessageAsync({
          message: "nonce:" + data.nonce,
        });
        const data2 = await fetch("http://localhost:3000/api/authenticate", {
          method: "POST",
          body: JSON.stringify({
            signature,
            walletAddress: address,
          }),
        });
        const body = await data2.json();
        if (body.result) {
          setCookie("jwt", body);
        }
      });
  };

  return (
    <div>
      <Nossr>
        <Navbar></Navbar>
        <div className="mt-40 border rounded-lg flex flex-col w-2/5 space-y-4 mx-auto px-4 py-12 text-center items-center justify-center">
          <h3 className="font-bold text-4xl"> Register</h3>
          <div className="inline">
            <p className="inline">Name: </p>
            <input
              className="inline bg-slate-50 border rouned-lg h-10"
              onChange={(e) => handleChange(e, "name")}
            ></input>
          </div>
          <div className="inline">
            <p className="inline">Email:</p>
            <input
              className="inline bg-slate-50 border rouned-lg h-10"
              type="email"
              onChange={(e) => handleChange(e, "email")}
            ></input>
          </div>
          <div className="inline">
            <p className="inline">Wallet Address: </p>
            {address}
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-800 font-semibold rounded-md text-white px-4 py-2 border"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </Nossr>
    </div>
  );
};
