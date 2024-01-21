import { DeflyWalletConnect } from "@blockshake/defly-connect";
import { PeraWalletConnect } from "@perawallet/connect";
import {
  Algodv2,
  algosToMicroalgos,
  isValidAddress,
  makePaymentTxnWithSuggestedParamsFromObject,
} from "algosdk";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { encode } from "uint8-to-base64";
import Connect from "../components/connect";
import FaqSection from "../components/faq";
import {
  ALGONODE_MAINNET_NODE,
  APPLY_FEE,
  BASE_FRONTEND_URL,
  FEE_WALLET,
} from "../constants";
import { SpecialAssetInputType } from "../types";
import { isValidAsset } from "../utils";

const peraWallet = new PeraWalletConnect({ shouldShowSignTxnToast: true });
const deflyWallet = new DeflyWalletConnect({ shouldShowSignTxnToast: true });

interface FormElements extends HTMLFormControlsCollection {
  collectionName: HTMLInputElement;
  creatorName: HTMLInputElement;
  creatorWallet: HTMLInputElement;
  blacklist: HTMLInputElement;
  specialAssets: HTMLInputElement;
  discordServerId: HTMLInputElement;
  defaultRoleId: HTMLInputElement;
  featuredAssetId: HTMLInputElement;
  verifymeChannelId: HTMLInputElement;
  discordInvite: HTMLInputElement;
  specialRoleID: HTMLInputElement;
  specialRoleAmount: HTMLInputElement;
}

interface ApplyFormElements extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function ApplyForm() {
  const [specialAssets, setSpecialAssets] = useState<SpecialAssetInputType[]>([
    {
      id: 1,
      assetId: null,
      roleId: null,
    },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Apply Collection | AlgoVerify";
  }, []);

  const SpecialAssetInputField = (specialAsset: SpecialAssetInputType) => {
    return (
      <div
        key={specialAsset.id}
        id={`specialAsset-${specialAsset.id}`}
        className="mb-2"
      >
        <input
          type="text"
          id={`assetId-${specialAsset.id}`}
          placeholder="Asset ID"
          className="w-24 md:w-28 bg-gray-300 text-sm font-medium text-center leading-none text-black placeholder:text-black/70 placeholder:text-xs px-3 py-2 border rounded border-gray-200"
          value={specialAssets
            .find((metadata) => metadata.id === specialAsset.id)
            ?.assetId?.toString()}
          onChange={(e) => {
            const newSpecialAssets = [...specialAssets];
            newSpecialAssets.find(
              (metadata) => metadata.id === specialAsset.id
            )!.assetId = Number(e.target.value);
            setSpecialAssets(newSpecialAssets);
          }}
        />
        <input
          type="text"
          id={`roleId-${specialAsset.id}`}
          placeholder="Role ID"
          className="w-24 md:w-28 bg-gray-300 ml-2 text-sm font-medium text-center leading-none text-black placeholder:text-black/70 placeholder:text-xs px-3 py-2 border rounded border-gray-200"
          value={specialAssets
            .find((metadata) => metadata.id === specialAsset.id)
            ?.roleId?.toString()}
          onChange={(e) => {
            const newSpecialAssets = [...specialAssets];
            newSpecialAssets.find(
              (metadata) => metadata.id === specialAsset.id
            )!.roleId = e.target.value;
            setSpecialAssets(newSpecialAssets);
          }}
        />
        <span
          className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={() => {
            const newSpecialAssets = [...specialAssets];
            newSpecialAssets.splice(
              newSpecialAssets.findIndex(
                (metadata) => metadata.id === specialAsset.id
              ),
              1
            );
            setSpecialAssets(newSpecialAssets);
            if (newSpecialAssets.length === 0) {
              setSpecialAssets([
                {
                  id: 1,
                  assetId: null,
                  roleId: null,
                },
              ]);
            }
          }}
        >
          -
        </span>
      </div>
    );
  };

  const applySubmit = async (event: React.FormEvent<ApplyFormElements>) => {
    const wallet = localStorage.getItem("wallet");
    if (!wallet) {
      toast.info("Please connect your wallet first!");
      return;
    }

    event.preventDefault();
    let myForm = event.currentTarget.elements;

    let formContent = {
      name: myForm.collectionName.value.trim(),
      creator_name: myForm.creatorName.value.trim(),
      creator_wallets: myForm.creatorWallet.value.split(",").map((wallet) => {
        return wallet.trim();
      }),
      blacklist: myForm.blacklist.value.split(",").map((asset) => {
        return asset.trim();
      }),
      server_id: myForm.discordServerId.value.trim(),
      holder_role: myForm.defaultRoleId.value.trim(),
      featured_asset: myForm.featuredAssetId.value.trim(),
      verify_channel: myForm.verifymeChannelId.value.trim(),
      invite_link: myForm.discordInvite.value.trim(),
      senderWallet: wallet,
      special_role: myForm.specialRoleID.value.trim() || null,
      special_amount: Number(myForm.specialRoleAmount.value.trim()) || null,
    };

    // check if all fields are filled
    if (
      formContent.name === "" ||
      formContent.creator_name === "" ||
      formContent.creator_wallets.length === 0 ||
      formContent.server_id === "" ||
      formContent.holder_role === "" ||
      formContent.featured_asset === "" ||
      formContent.verify_channel === "" ||
      formContent.invite_link === "" ||
      formContent.senderWallet === ""
    ) {
      toast.info("Please fill all required fields!");
      return;
    }

    // remove empty creator wallets and blacklisted assets
    formContent.creator_wallets = formContent.creator_wallets.filter(
      (wallet) => wallet.length !== 0
    );

    formContent.blacklist = formContent.blacklist.filter(
      (asset) => asset.length !== 0
    );

    // validate creator_wallets
    if (formContent.creator_wallets.length === 0) {
      toast.info("Please enter at least one creator wallet");
      return;
    }

    for (let i = 0; i < formContent.creator_wallets.length; i++) {
      const wallet = formContent.creator_wallets[i];
      if (!isValidAddress(wallet)) {
        toast.info("Please enter valid creator wallets");
        return;
      }
    }

    // validate special assets
    let specialAssetsForm = specialAssets;
    for (let i = 0; i < specialAssetsForm.length; i++) {
      const asset = specialAssetsForm[i];
      if (asset.assetId !== null && asset.roleId !== null) {
        const isValid = await isValidAsset(asset.assetId);
        if (!isValid) {
          toast.info("Please enter valid special assets");
          return;
        }
      } else {
        specialAssetsForm.splice(i, 1);
        i--;
      }
    }

    // validate blacklist assets
    for (let i = 0; i < formContent.blacklist.length; i++) {
      const asset = formContent.blacklist[i];
      const isValid = await isValidAsset(Number(asset));
      if (!isValid) {
        toast.info("Please enter valid blacklist assets");
        return;
      }
    }

    // validate featured asset
    const isValidFeaturedAsset = await isValidAsset(
      Number(formContent.featured_asset)
    );
    if (!isValidFeaturedAsset) {
      toast.info("Please enter valid featured asset");
      return;
    }

    const blacklistedAssets = formContent.blacklist.map((asset) =>
      Number(asset)
    );

    const projectAssets = specialAssetsForm
      .filter((asset) => asset.assetId !== null && asset.roleId !== null)
      .map((asset) => {
        return {
          assetId: asset.assetId,
          roleId: asset.roleId,
        };
      });

    const algodClient = new Algodv2("", ALGONODE_MAINNET_NODE, "");
    const params = await algodClient.getTransactionParams().do();
    const tx = makePaymentTxnWithSuggestedParamsFromObject({
      from: formContent.senderWallet,
      to: FEE_WALLET,
      amount: algosToMicroalgos(APPLY_FEE),
      note: new TextEncoder().encode("AlgoVerify Apply Fee"),
      suggestedParams: params,
    });

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
    } catch (e) {
      toast.error("Couldn't sign transaction!");
      return;
    }

    if (encoded.length > 0) {
      const applyData = {
        tx: encoded,
        data: {
          name: formContent.name,
          creatorName: formContent.creator_name,
          guildId: formContent.server_id,
          holderRoleId: formContent.holder_role,
          verifyChannel: formContent.verify_channel,
          featuredAsset: Number(formContent.featured_asset),
          inviteLink: formContent.invite_link,
          specialAmount: formContent.special_amount || null,
          specialRoleId: formContent.special_role || null,
        },
        projectAssets: projectAssets,
        blacklistedAssets: blacklistedAssets,
        creatorWallets: formContent.creator_wallets,
      };

      await toast.promise(
        axios.post(`${BASE_FRONTEND_URL}/api/apply`, applyData),
        {
          pending: "Sending...",
          success: "🎉 Successfully sent! Please wait for approval 🙏",
          error: {
            render(data: any) {
              return (
                <div>
                  <p>
                    ❌ Error:{" "}
                    {data.response && data.response.data
                      ? data.response.data
                      : "Something went wrong!"}
                  </p>
                </div>
              );
            },
          },
        }
      );
    }
  };

  return (
    <div className="bg-gray-900">
      <div className="text-center bg-gray-900 flex flex-col min-h-screen justify-between text-white">
        <div className="overflow-y-visible">
          <h2 className="text-3xl text-centertext-gray-50 font-bold my-4">
            Apply for AlgoVerify
          </h2>
          <div className="font-bold w-full max-w-2xl px-6 py-2 mx-auto rounded-md shadow-md bg-gray-800">
            <div>
              1- Connect your wallet
              <div className="m-2">
                <Connect />
              </div>
              <form onSubmit={applySubmit}>
                2- Fill the form
                <div className="flex flex-col items-center m-2">
                  <div className="w-48 mx-2">
                    <input
                      placeholder="Collection Name"
                      className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 placeholder:font-semibold placeholder:text-sm"
                      type="text"
                      id="collectionName"
                      about="Collection Name"
                    />
                  </div>
                  <div className="w-48 mx-2 my-2">
                    <input
                      placeholder="Creator Name"
                      className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 placeholder:font-semibold placeholder:text-sm"
                      type="text"
                      id="creatorName"
                    />
                  </div>
                  <hr className="w-72 lg:mt-2 my-2 mx-auto" />
                  <div className="w-48 md:w-64 mt-2">
                    <textarea
                      placeholder="Creator Wallet(s)"
                      className="block w-full h-24 px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 placeholder:font-semibold placeholder:text-center placeholder:text-sm"
                      id="creatorWallet"
                    />
                    <label className="block my-1 text-xs font-medium text-gray-500">
                      If you have multiple wallets for your collection, enter
                      your wallets seperated by commas.
                    </label>
                  </div>
                  <hr className="w-72 lg:mt-2 my-2" />
                  <div className="w-48 md:w-64 mt-2">
                    <textarea
                      placeholder="Blacklist Asset(s)"
                      className="block w-full h-24 px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 placeholder:font-semibold placeholder:text-center placeholder:text-sm"
                      id="blacklist"
                    />
                    <label className="block my-1 text-xs font-medium text-gray-500">
                      (Optional) If you want to blacklist any asset, enter the
                      asset ID of the asset you want to blacklist seperated by
                      commas.
                    </label>
                  </div>
                  <hr className=" w-72 lg:mt-2 my-2" />
                  <div className="w-64 md:w-72 mt-2">
                    <div>
                      {specialAssets.map((specialAsset) => {
                        return SpecialAssetInputField(specialAsset);
                      })}
                    </div>
                    <div
                      className="rounded-md bg-green-400 hover:bg-green-500 transition text-black px-4 py-1 w-12 mx-auto"
                      onClick={() => {
                        let lastId;
                        try {
                          lastId = specialAssets[specialAssets.length - 1].id;
                        } catch (error) {
                          lastId = 0;
                        }
                        setSpecialAssets([
                          ...specialAssets,
                          {
                            id: lastId + 1,
                            assetId: null,
                            roleId: null,
                          },
                        ]);
                      }}
                    >
                      +
                    </div>
                    <label className="block my-1 text-xs font-medium text-gray-500">
                      (Optional) If you want to give a special role to people
                      who own an specific asset, enter the asset ID and special
                      role ID.
                    </label>
                  </div>
                  <hr className="w-72 lg:mt-2 my-2" />
                  <div className="w-48 mx-2 mt-2 space-y-2">
                    <input
                      placeholder="Server ID"
                      className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 placeholder:text-sm"
                      type="number"
                      id="discordServerId"
                    />
                    <input
                      placeholder="Default Role ID"
                      className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 placeholder:text-sm"
                      type="number"
                      id="defaultRoleId"
                    />
                    <label className="block my-1 text-xs font-medium text-gray-500">
                      This role will be given to all holders of your collection.
                    </label>
                    <input
                      placeholder="Verify Channel ID"
                      className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 placeholder:text-sm"
                      type="number"
                      id="verifymeChannelId"
                    />
                    <input
                      placeholder="Featured Asset ID"
                      className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 placeholder:text-sm"
                      type="number"
                      id="featuredAssetId"
                    />
                    <label className="block my-1 text-xs font-medium text-gray-500">
                      This asset's image will be shown on collection page.
                    </label>
                    <input
                      placeholder="Server Invite Link"
                      className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 placeholder:text-sm"
                      type="text"
                      id="discordInvite"
                    />
                  </div>
                  <hr className="w-72 lg:mt-2 my-2" />
                  <div className="w-48 mx-2">
                    <label className="block my-1 text-xs font-medium text-gray-500">
                      (Optional) If you want to give a special role to people
                      who own more than a specific number of asset of your
                      collection, enter the ASA ID and special role ID.
                    </label>
                    <input
                      placeholder="Special Role ID"
                      className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 placeholder:text-sm"
                      type="number"
                      id="specialRoleID"
                    />
                    <input
                      placeholder="Special Role Amount"
                      className="block w-full mt-2 px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 placeholder:text-sm"
                      type="number"
                      id="specialRoleAmount"
                    />
                  </div>
                </div>
                <hr className="w-72 lg:mt-2 my-2 mx-auto" />
                3- Complete
                <div className="m-2">
                  <p className="text-xs text-slate-400 mb-1">
                    {APPLY_FEE}A apply fee to prevent spam applications.{" "}
                  </p>
                  <button
                    type="submit"
                    className="bg-green-600 px-6 py-2 text-lg sm:text-xl font-bold text-slate-50 hover:text-slate-100 hover:bg-green-700 shadow-md hover:shadow-none transition-all rounded"
                  >
                    Send
                  </button>
                </div>
              </form>
              <hr className="w-72 lg:mt-2 my-2 mx-auto" />
              <div className="w-72 mx-auto">
                4- Add the bot to your server
                <br />
                <button className="bg-orange-600 px-6 py-2 text-lg sm:text-xl font-bold text-slate-50 hover:text-slate-100 hover:bg-orange-700 shadow-md hover:shadow-none transition-all rounded mt-2">
                  <a
                    href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_BOT_CLIENT_ID}&permissions=2416076800&scope=bot`}
                    target="_blank no-referrer"
                  >
                    Add
                  </a>
                </button>
                <label className="block my-1 text-xs font-medium text-gray-500">
                  You should make the bot's role hierarchy higher than the roles
                  you entered in the form. Otherwise, the bot won't be able to
                  give roles to users. You can check{" "}
                  <a
                    href="https://support.discord.com/hc/en-us/articles/214836687-Role-Management-101"
                    target="_blank no-referrer"
                    className="font-bold text-green-500 hover:text-green-400"
                  >
                    this article
                  </a>{" "}
                  for more information.
                </label>
              </div>
            </div>
          </div>
          <FaqSection />
          <h2 className="text-md font-semibold text-base text-slate-300">
            Contact
          </h2>
          <p className="text-sm">
            You can open issue on
            <a
              href="https://github.com/algovado/algoverify"
              target="_blank no-referrer"
              className="font-bold text-green-500 hover:text-green-400"
            >
              {" "}
              GitHub
            </a>{" "}
            if you have any questions or issues .
          </p>
        </div>
        <div className="p-4 mt-4 bg-gray-800 text-center w-full space-x-8">
          <Link
            to="/"
            className=" text-gray-300 hover:text-green-400 transition-all text-xl font-bold"
          >
            Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
