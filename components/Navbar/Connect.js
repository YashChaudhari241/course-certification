import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState } from "react";
// import { useTheme } from "next-themes"
import AccountInfo from "./AccountInfo";
import ChooseWalletModal from "./ChooseWalletModal";
export function Connect() {
  const { connector, isConnected } = useAccount();
  // const { theme, systemTheme } = useTheme()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  // const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark")
  const [isModalOpen, setModal] = useState(false);
  return (
    <div>
      <div>
        {isConnected && (
          // <button
          //     type="button"
          //     onClick={() => disconnect()}
          //     className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          // >
          //     Disconnect {connector.name}
          // </button>
          <AccountInfo />
        )}
        {!isConnected && (
          <button
            type="button"
            onClick={() => setModal(true)}
            className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Connect
          </button>
        )}
      </div>
      <ChooseWalletModal isModalOpen={isModalOpen} setModal={setModal} />
      {/* {error && <div>{error.message}</div>} */}
    </div>
  );
}
