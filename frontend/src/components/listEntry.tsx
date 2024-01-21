import { useEffect, useState } from "react";
import { getNfdDomain } from "../utils";

export interface Leaderboard {
  count: number;
  wallet: string;
  nfd?: string;
  index: number;
}

export default function ListEntry(props: Leaderboard) {
  const [domain, setDomain] = useState<string>(
    props.wallet.substring(0, 5) +
      "..." +
      props.wallet.substring(props.wallet.length - 5)
  );

  const [url, setUrl] = useState<string>(
    "https://allo.info/account/" + props.wallet
  );
  
  useEffect(() => {
    getNfdDomain(props.wallet).then((domain) => {
      setDomain(domain);
      if (domain.endsWith(".algo")) {
        setUrl("https://app.nf.domains/name/" + domain);
      }
    });
  }, [props.wallet]);

  return (
    <tr
      className=" border-b bg-gray-800 border-gray-700 hover:bg-gray-600  transition"
      key={props.wallet}
    >
      <th
        scope="row"
        className="px-6 py-4 font-medium text-white whitespace-nowrap"
      >
        {props.index + 1}
      </th>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-white whitespace-nowrap"
      >
        <a
          className="hover:underline"
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {domain}
        </a>
      </th>
      <td className="px-6 py-4">{props.count}</td>
    </tr>
  );
}
