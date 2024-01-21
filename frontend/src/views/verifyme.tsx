import { DeflyWalletConnect } from "@blockshake/defly-connect";
import { PeraWalletConnect } from "@perawallet/connect";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { encode } from "uint8-to-base64";
import Connect from "../components/connect";
import { BASE_FRONTEND_URL } from "../constants";
import { verfiyWithUuidTxCreate } from "../utils";

const peraWallet = new PeraWalletConnect({ shouldShowSignTxnToast: true });
const deflyWallet = new DeflyWalletConnect({ shouldShowSignTxnToast: true });

export default function Verifyme() {
  let { slug } = useParams();
  const [userCount, setUserCount] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_FRONTEND_URL}/api/userCount`);
      const data = await response.json();
      setUserCount(data);
    };
    fetchData();
  }, []);

  const postData = async () => {
    const wallet = localStorage.getItem("wallet");
    if (!wallet) {
      return toast.error("Please connect your wallet first!");
    }

    let signedTxnPera: Uint8Array[];
    let encoded = "";

    const tx = await verfiyWithUuidTxCreate(wallet);

    try {
      const singleTxnGroups = [{ txn: tx }];
      if (localStorage.getItem("PeraWallet.Wallet") != null) {
        await peraWallet.reconnectSession();
        signedTxnPera = await peraWallet.signTransaction([singleTxnGroups]);
      } else {
        await deflyWallet.reconnectSession();
        signedTxnPera = await deflyWallet.signTransaction([singleTxnGroups]);
        if (signedTxnPera) {
          encoded = encode(signedTxnPera[0]);
        }
      }

      if (signedTxnPera) {
        encoded = encode(signedTxnPera[0]);
      } else {
        toast.error("Couldn't sign transaction!");
        return;
      }

      if (encoded.length > 0) {
        await axios.post(`${BASE_FRONTEND_URL}/api/verifyUuid/${slug}`, {
          tx: encoded,
        });
        toast.success("Successfully verified your wallet!");
      }
    } catch (e: any) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data || "Something went wrong!");
        return;
      }
      toast.error(e.message || "Something went wrong!");
      return;
    }
  };

  return (
    <div className="text-center bg-gray-900 flex flex-col min-h-screen text-white justify-start">
      <p className="text-5xl font-semibold pb-8 pt-8 text-orange-500">
        <a href="/">AlgoVerify</a>
      </p>
      <div className="font-bold bg-slate-800 w-fit mx-auto p-4 rounded-xl">
        1- Connect your wallet
        <div className="m-2">
          <Connect />
        </div>
        2- Verify yourself
        <div className="m-2">
          <button
            onClick={postData}
            id="verify"
            className="rounded bg-green-600 px-6 py-2 text-lg sm:text-xl font-bold text-slate-50 hover:text-slate-100 hover:bg-green-700 shadow-md hover:shadow-none transition-all"
          >
            <span>Verify</span>
          </button>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        This transaction will be sent to the network.
      </p>
      <p className="font-semibold text-lg mt-4">
        <span className="font-bold text-2xl text-green-500">{userCount}</span>{" "}
        users verified by AlgoVerify!
      </p>
      <div className="p-4 mt-4 bg-gray-800 text-center w-full absolute bottom-0">
        <Link
          to="/"
          className=" text-gray-300 hover:text-green-400 transition-all text-xl font-bold"
        >
          Home Page
        </Link>
      </div>
    </div>
  );
}
