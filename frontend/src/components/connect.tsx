import { DeflyWalletConnect } from "@blockshake/defly-connect";
import { PeraWalletConnect } from "@perawallet/connect";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { shortenWallet } from "../utils";

const peraWallet = new PeraWalletConnect();
const deflyWallet = new DeflyWalletConnect();

export default function Connect() {
  const [wallet, setWallet] = useState("");
  const [showConnects, setShowConnects] = useState(false);

  useEffect(() => {
    const localwallet = localStorage.getItem("wallet");
    if (localwallet != null) {
      setWallet(localwallet);
    }
  }, []);

  const handleClick = () => {
    if (localStorage.getItem("wallet") != null) {
      handleDisconnect();
    } else {
      setShowConnects(true);
    }
  };

  const connectToPera = async () => {
    try {
      const accounts = await peraWallet.connect();
      setWallet(accounts[0]);
      localStorage.setItem("wallet", accounts[0]);
      toast.success("Connected!");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const connectToDefly = async () => {
    try {
      const accounts = await deflyWallet.connect();
      setWallet(accounts[0]);
      localStorage.setItem("wallet", accounts[0]);
      toast.success("Connected!");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDisconnect = async () => {
    try {
      await peraWallet.disconnect();
    } catch (error) {}
    try {
      await deflyWallet.disconnect();
    } catch (error) {}
    localStorage.clear();
    setWallet("");
    toast.success("Disconnected!");
    window.location.reload();
  };

  if (wallet === "") {
    return (
      <div className="flex flex-col items-center">
        <button
          onClick={handleClick}
          className={`bg-rose-600 px-6 py-2 text-lg sm:text-xl font-bold text-slate-50 hover:text-slate-100 hover:bg-rose-700 shadow-md hover:shadow-none transition-all rounded ${
            showConnects && "hidden"
          }`}
        >
          Connect
        </button>
        <div
          className={`flex flex-col items-center space-y-2  ${
            !showConnects && "hidden"
          }`}
        >
          <button
            onClick={connectToPera}
            className="bg-[#ffee55] px-5 py-2 rounded-md w-32 text-black  hover:scale-95 transition"
          >
            Pera
          </button>
          <button
            onClick={connectToDefly}
            className="bg-[#131313] px-5 py-2 rounded-md w-32 text-white  hover:scale-95 transition"
          >
            Defly
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <button
          onClick={handleClick}
          className="bg-red-600 px-6 py-2 text-base sm:text-lg font-bold text-white hover:bg-red-700 hover:scale-95 
      ease-in-out duration-700 hover:shadow-none rounded font-roboto"
        >
          Disconnect
        </button>
        <p className="text-red-300 font-bold text-sm my-2 font-roboto">
          <a
            className="hover:text-red-400 font-roboto transition"
            href={"https://allo.info/account/" + wallet}
            target="_blank noopener noreferrer"
          >
            {shortenWallet(wallet)}
          </a>
        </p>
      </div>
    );
  }
}
