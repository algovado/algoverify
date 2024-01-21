import { DeflyWalletConnect } from "@blockshake/defly-connect";
import { PeraWalletConnect } from "@perawallet/connect";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { encode } from "uint8-to-base64";
import { BASE_FRONTEND_URL } from "../constants";
import { verifyTxCreate } from "../utils";

export default function Verify() {
  const peraWallet = new PeraWalletConnect({ shouldShowSignTxnToast: true });
  const deflyWallet = new DeflyWalletConnect({ shouldShowSignTxnToast: true });
  const wallet = localStorage.getItem("wallet") || "";

  const postData = async () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");

    if (wallet.length === 0) {
      toast.error("Please connect your wallet first");
      return;
    } else if (accessToken != null) {
      const tx = await verifyTxCreate(wallet, accessToken);

      let signedTxn: Uint8Array[];
      let encoded = "";

      try {
        const singleTxnGroups = [{ txn: tx }];
        if (localStorage.getItem("PeraWallet.Wallet") != null) {
          await peraWallet.reconnectSession();
          signedTxn = await peraWallet.signTransaction([singleTxnGroups]);
        } else {
          await deflyWallet.reconnectSession();
          signedTxn = await deflyWallet.signTransaction([singleTxnGroups]);
        }

        if (signedTxn) {
          encoded = encode(signedTxn[0]);
        } else {
          toast.error("Couldn't sign transaction!");
          return;
        }

        if (encoded.length > 0) {
          await axios
            .post(`${BASE_FRONTEND_URL}/api/verify`, {
              tx: encoded,
              token: accessToken,
            })
            .then((res) => {
              toast.success("Successfully verified your wallet.");
            });
          return;
        }
      } catch (e: any) {
        if (e instanceof AxiosError) {
          toast.error(e.response?.data || "Something went wrong!");
          return;
        }
        toast.error(e.message || "Something went wrong!");
        return;
      }
    } else {
      toast.error("Please connect your Discord first");
      return;
    }
  };

  return (
    <div>
      <button
        onClick={postData}
        id="verify"
        className="rounded bg-green-600 px-6 py-2 text-lg sm:text-xl font-bold text-slate-50 hover:text-slate-100 hover:bg-green-700 shadow-md hover:shadow-none transition-all"
      >
        <span>Verify</span>
      </button>
    </div>
  );
}
