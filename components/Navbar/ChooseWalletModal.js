import { PulseLoader } from "react-spinners";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Metamask } from "@web3uikit/icons";
// import { Modal, CryptoLogos, Illustration } from "@web3uikit/core";
export default (props) => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { connector, isConnected } = useAccount();

  if (isConnected) {
    props.setModal(false);
  }
  return (
    props.isModalOpen && (
      <div className="relative">
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 justify-items-center px-96 gap-y-6 fixed top-20 left-0 py-3 gap-x-3 w-full">
          {connectors
            .filter((x) => x.ready && x.id !== connector?.id)
            .map((x) => (
              <div
                className={
                  "w-60 h-60 rounded-lg border bg-gray-100 cursor-pointer hover:bg-gray-200 flex flex-col hover:border-slate-400 dark:bg-gray-800 dark:border-gray-600" +
                  (x.id === pendingConnector?.id
                    ? " ring-2 ring-gray-400"
                    : " ")
                }
                key={x.id}
                onClick={() => connect({ connector: x })}
              >
                {x.name === "MetaMask" && (
                  <div className="basis-3/4 flex justify-center items-center">
                    <Metamask fontSize="64px" />
                  </div>
                )}
                {x.name === "Coinbase Wallet" && (
                  <div className="basis-3/4 flex justify-center items-center"></div>
                )}

                {x.name === "Injected" && (
                  <div className="basis-3/4 flex justify-center items-center"></div>
                )}
                {isLoading && x.id === pendingConnector?.id ? (
                  <PulseLoader
                    color={"#475569"}
                    className="m-auto basis-1/4"
                    size={12}
                  />
                ) : (
                  <p className="basis-1/4 text-center text-gray-600 dark:text-gray-400 text-lg font-bold">
                    {x.name}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
    )
  );
};
