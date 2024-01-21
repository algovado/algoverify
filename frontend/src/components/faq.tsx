import { useState } from "react";
import { APPLY_FEE } from "../constants";

const FaqSection = () => {
  const [open, setOpen] = useState(true);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);
  const [open7, setOpen7] = useState(false);

  return (
    <div className=" lg:container lg:mx-auto lg:py-8 md:py-12 md:px-6 px-4 mt-4 md:mt-2">
      <h1 className="text-centcer lg:text-4xl text-3xl lg:leading-9 leading-7 text-gray-100 font-semibold">
        FAQ's
      </h1>
      <div className="lg:w-8/12 w-full mx-auto text-start">
        <hr className=" w-full lg:mt-10 md:mt-12 md:mb-8 my-8" />
        <div className="w-full md:px-6  ">
          <div
            id="mainHeading"
            className="flex justify-between items-center w-full"
          >
            <div className=" ">
              <p className="flex justify-center items-center font-medium text-base leading-6 md:leading-4 text-gray-100" onClick={() => setOpen(!open)}>
                {" "}
                <span className="  lg:mr-6 mr-4 lg:text-2xl md:text-xl text-lg leading-6 md:leading-5 lg:leading-4 font-semibold text-gray-100">
                  Q1.
                </span>{" "}
                What is the AlgoVerify?
              </p>
            </div>
            <button
              aria-label="toggler"
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              onClick={() => setOpen(!open)}
            >
              <svg
                className={"transform " + (open ? "rotate-180" : "rotate-0")}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="black"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div
            id="menu"
            className={"mt-6 w-full " + (open ? "block" : "hidden")}
          >
            <p className="text-base leading-6 text-gray-400 font-normal">
              AlgoVerify is a Discord verification system (bot + website) for
              Algorand projects. It has been working actively for 2 years.
            </p>
          </div>
        </div>
        <hr className=" w-full lg:mt-10 my-8" />
        <div className="w-full md:px-6 ">
          <div
            id="mainHeading"
            className="flex justify-between items-center w-full"
          >
            <div className="">
              <p className="flex justify-center items-center font-medium text-base leading-6 lg:leading-4 text-gray-100" onClick={() => setOpen2(!open2)}>
                {" "}
                <span className="  lg:mr-6 mr-4 lg:text-2xl md:text-xl text-lg leading-6 md:leading-5 lg:leading-4 font-semibold text-gray-100">
                  Q2.
                </span>{" "}
                What is the cost?
              </p>
            </div>
            <button
              aria-label="toggler"
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              onClick={() => setOpen2(!open2)}
            >
              <svg
                className={"transform " + (open2 ? "rotate-180" : "rotate-0")}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="black"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div
            id="menu"
            className={"mt-6 w-full " + (open2 ? "block" : "hidden")}
          >
            <p className="text-base leading-6 text-gray-400 font-normal">
              <p className="text-center text-2xl">FREE!</p>This project funded
              by Algorand Foundation's{" "}
              <a
                href="https://github.com/algorandfoundation/xGov"
                className="text-green-400 hover:text-green-500"
              >
                xGov program
              </a>{" "}
              and will be free until the end of the 2024.
              <br />
              There is <b>{APPLY_FEE}A</b> fee to prevent spam applications.
            </p>
          </div>
        </div>
        <hr className=" w-full lg:mt-10 my-8" />
        <div className="w-full md:px-6 ">
          <div
            id="mainHeading"
            className="flex justify-between items-center w-full"
          >
            <div className="">
              <p className="flex justify-center items-center font-medium text-base leading-6 lg:leading-4 text-gray-100" onClick={() => setOpen3(!open3)}>
                {" "}
                <span className="  lg:mr-6 mr-4 lg:text-2xl md:text-xl text-lg leading-6 md:leading-5 lg:leading-4 font-semibold text-gray-100">
                  Q3.
                </span>
                Do you have API?
              </p>
            </div>
            <button
              aria-label="toggler"
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              onClick={() => setOpen3(!open3)}
            >
              <svg
                className={"transform " + (open3 ? "rotate-180" : "rotate-0")}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="black"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div
            id="menu"
            className={"mt-6 w-full " + (open3 ? "block" : "hidden")}
          >
            <p className="text-base leading-6 text-gray-400 font-normal">
              Yes, you can use our API for your project. You can find the
              documentation{" "}
              <a
                href="https://www.algoverify.me/api-docs"
                className="text-green-400 hover:text-green-500"
              >
                here
              </a>
              .
            </p>
          </div>
        </div>
        <hr className=" w-full lg:mt-10 my-8" />
        <div className="w-full md:px-6  ">
          <div
            id="mainHeading"
            className="flex justify-between items-center w-full"
          >
            <div className="">
              <p className="flex justify-center items-center font-medium text-base leading-6 lg:leading-4 text-gray-100" onClick={() => setOpen4(!open4)}>
                {" "}
                <span className="  lg:mr-6 mr-4 lg:text-2xl md:text-xl text-lg leading-6 md:leading-5 lg:leading-4 font-semibold text-gray-100">
                  Q4.
                </span>
                How can I update or cancel my application?
              </p>
            </div>
            <button
              aria-label="toggler"
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              onClick={() => setOpen4(!open4)}
            >
              <svg
                className={"transform " + (open4 ? "rotate-180" : "rotate-0")}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="black"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div
            id="menu"
            className={"mt-6 w-full " + (open4 ? "block" : "hidden")}
          >
            <p className="text-base leading-6 text-gray-400 font-normal">
              You can open an issue on{" "}
              <a
                href="https://github.com/algovado/algoverify/issues"
                className="text-green-400 hover:text-green-500"
              >
                GitHub
              </a>{" "}
              or contact us via{" "}
              <a
                href="https://x.com/cryptolews"
                className="text-green-400 hover:text-green-500"
              >
                {" "}
                Twitter
              </a>
              .
            </p>
          </div>
        </div>
        <hr className=" w-full lg:mt-10 my-8" />
        <div className="w-full md:px-6 ">
          <div
            id="mainHeading"
            className="flex justify-between items-center w-full"
          >
            <div className="">
              <p className="flex justify-center items-center font-medium text-base leading-6 lg:leading-4 text-gray-100" onClick={() => setOpen5(!open5)}>
                {" "}
                <span className="  lg:mr-6 mr-4 lg:text-2xl md:text-xl text-lg leading-6 md:leading-5 lg:leading-4 font-semibold text-gray-100">
                  Q5.
                </span>
                How can I get server id, holder role id and channel id for
                application form?
              </p>
            </div>
            <button
              aria-label="toggler"
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              onClick={() => setOpen5(!open5)}
            >
              <svg
                className={"transform " + (open5 ? "rotate-180" : "rotate-0")}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="black"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div
            id="menu"
            className={"mt-6 w-full " + (open5 ? "block" : "hidden")}
          >
            <p className="text-base leading-6 text-gray-400 font-normal">
              <p className="mt-4">
                For Server ID click{" "}
                <a
                  className="font-bold text-green-500 hover:text-green-400"
                  target="_blank no-referrer"
                  href="https://www.alphr.com/discord-find-server-id/"
                >
                  here
                </a>
                .
                <br />
                For Holder Role ID click{" "}
                <a
                  className="font-bold text-green-500 hover:text-green-400"
                  target="_blank no-referrer"
                  href="https://anidiots.guide/understanding/roles/#get-role-by-name-or-id"
                >
                  here
                </a>
                .
                <br />
                For Verifyme Channel ID click{" "}
                <a
                  className="font-bold text-green-500 hover:text-green-400"
                  target="_blank no-referrer"
                  href="https://docs.statbot.net/docs/faq/general/how-find-id/"
                >
                  here
                </a>
                .
              </p>
            </p>
          </div>
        </div>
        <hr className=" w-full lg:mt-10 my-8" />
        <div className="w-full md:px-6 ">
          <div
            id="mainHeading"
            className="flex justify-between items-center w-full"
          >
            <div className="">
              <p className="flex justify-center items-center font-medium text-base leading-6 lg:leading-4 text-gray-100" onClick={() => setOpen6(!open6)}>
                {" "}
                <span className="  lg:mr-6 mr-4 lg:text-2xl md:text-xl text-lg leading-6 md:leading-5 lg:leading-4 font-semibold text-gray-100">
                  Q6.
                </span>
                I want to host my own bot, how can I do that?
              </p>
            </div>
            <button
              aria-label="toggler"
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              onClick={() => setOpen6(!open6)}
            >
              <svg
                className={"transform " + (open6 ? "rotate-180" : "rotate-0")}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="black"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div
            id="menu"
            className={"mt-6 w-full " + (open6 ? "block" : "hidden")}
          >
            <p className="text-base leading-6 text-gray-400 font-normal">
              You can find the bot's source code{" "}
              <a
                href="https://github.com/algovado/algoverify"
                className="text-green-400 hover:text-green-500"
              >
                here
              </a>
              . You can follow the instructions in the README file to host your
              own bot.
            </p>
          </div>
        </div>
        <hr className=" w-full lg:mt-10 my-8" />
        <div className="w-full md:px-6 ">
          <div
            id="mainHeading"
            className="flex justify-between items-center w-full"
          >
            <div className="">
              <p className="flex justify-center items-center font-medium text-base leading-6 lg:leading-4 text-gray-100" onClick={() => setOpen7(!open7)}>
                {" "}
                <span className="  lg:mr-6 mr-4 lg:text-2xl md:text-xl text-lg leading-6 md:leading-5 lg:leading-4 font-semibold text-gray-100">
                  Q7.
                </span>
                I applied, what's next?
              </p>
            </div>
            <button
              aria-label="toggler"
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              onClick={() => setOpen7(!open7)}
            >
              <svg
                className={"transform " + (open7 ? "rotate-180" : "rotate-0")}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="black"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div
            id="menu"
            className={"mt-6 w-full " + (open7 ? "block" : "hidden")}
          >
            If you filled out the form correctly and{" "}
            <a
              href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_BOT_CLIENT_ID}&permissions=2416076800&scope=bot`}
              target="_blank no-referrer"
              className="text-green-400 hover:text-green-500"
            >
              added
            </a>{" "}
            Verify Bot to the your server with the necessary permissions, you
            can just sit back and wait. <br/>You can see your collection on the{" "}
            <a
              href="/collections"
              className="text-green-400 hover:text-green-500"
            >
              collections
            </a>{" "}
            page when your application is approved.
          </div>
        </div>
        <hr className=" w-full lg:mb-10 my-8" />
      </div>
    </div>
  );
};

export default FaqSection;
