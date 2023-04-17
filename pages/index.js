import Navbar from "@/components/Navbar/Navbar";
import { useAccount, useSignMessage } from "wagmi";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

export default () => {
  const { address } = useAccount();
  const { push } = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["access-token"]);
  const { signMessageAsync } = useSignMessage();
  if (cookies["jwt"] !== undefined && cookies["jwt"] !== null) {
    push("/certs/" + address);
  }
  const handleAuth = async () => {
    const nonce = await fetch("http://localhost:3000/api/get_nonce", {
      method: "POST",
      body: JSON.stringify({
        walletAddress: address,
      }),
      mode: "same-origin",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const body = await nonce.json();
    const signature = await signMessageAsync({
      message: "nonce:" + body,
    });
    const data2 = await fetch("http://localhost:3000/api/authenticate", {
      method: "POST",
      body: JSON.stringify({
        signature,
        walletAddress: address,
      }),
    });
    const body2 = await data2.json();
    if (body.result) {
      setCookie("jwt", body2);
    }
  };
  return (
    <div>
      <Navbar></Navbar>
      <div className="w-full h-full flex justify-center space-x-10 mt-60">
        <Link
          className="bg-slate-200 hover:bg-slate-300 font-semibold rounded-md text-slate-800 px-4 py-2 border"
          href="/register"
        >
          Register
        </Link>
        <button
          className="bg-blue-600 hover:bg-blue-800 font-semibold rounded-md text-white px-4 py-2 border"
          onClick={handleAuth}
        >
          Login
        </button>
      </div>
    </div>
  );
};
