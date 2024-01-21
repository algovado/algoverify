import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Connect from "../components/connect";
import Discord from "../components/discord";
import Verify from "../components/verify";
import { BASE_FRONTEND_URL } from "../constants";

export default function Home() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "AlgoVerify";
    const fetchData = async () => {
      const response = await fetch(`${BASE_FRONTEND_URL}/api/userCount`);
      const data = await response.json();
      setUserCount(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="text-center bg-gray-900 flex flex-col min-h-screen justify-between text-white">
        <div className="overflow-y-visible">
          <p className="text-5xl font-semibold pb-4 pt-8">
            <a href="/">AlgoVerify</a>
          </p>
          <div className="flex flex-col items-center pb-4">
            <img
              src="./images/logo.png"
              className="h-48 w-48 rounded-full mr-2"
              alt="AlgoVerify"
            />
          </div>
          <div className="font-bold">
            1- Connect Wallet
            <div className="m-2">
              <Connect />
            </div>
            2- Connect Discord
            <div className="m-2">
              <Discord />
            </div>
            3- Verify
            <div className="m-2">
              <Verify />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            *If you don't want to share your Discord data with API
            <br />
            you can use <b>/privacy</b> command on Discord.
          </p>
        </div>
        <p className="font-semibold text-lg mt-4">
          <span className="font-bold text-2xl text-green-500">{userCount}</span>{" "}
          users verified by AlgoVerify!
        </p>
        <p className="text-xs text-slate-400 mb-4">
          This project is{" "}
          <a
            href="https://github.com/algovado/algoverify"
            target="_blank"
            rel="noreferrer"
            className="text-green-400 hover:text-green-500 transition-all"
          >
            open source
          </a>
          .
        </p>
        <div className="flex flex-row items-center justify-center gap-3 mx-auto">
          <a
            href="https://xgov.algorand.foundation?ref=algoverify"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={"/images/af_logo.svg"}
              alt="af-logo"
              width={64}
              height={64}
              className="mb-2 md:mb-0"
              about="xGov"
            />
          </a>
          <a
            href="https://algonode.io?ref=algoverify"
            target="_blank"
            rel="noreferrer noopener"
            className="font-normal text-primary-gray transition text-xs text-center hover:text-white"
          >
            powered by <br /> Algonode.io
          </a>
        </div>
        <div className="py-4 bg-gray-800 text-ellipsis w-full flex flex-col md:flex-row md:space-x-8 md:justify-center ">
          <Link
            to="/collections"
            className=" text-green-400 hover:text-green-600 transition-all text-xl font-bold"
          >
            Collections
          </Link>
          <Link
            to="/apply"
            className=" text-red-500 hover:text-red-700 transition-all text-xl font-bold"
          >
            Apply Collection & FAQ
          </Link>
          <a
            href="/api-docs"
            target="_blank"
            rel="noreferrer"
            className=" text-green-500 hover:text-green-600 transition-all text-xl font-bold"
          >
            API
          </a>
        </div>
      </div>
    </div>
  );
}
