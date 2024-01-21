import axios from "axios";
import { useEffect, useState } from "react";
import { ALGONODE_IDX_NODE_URL } from "../constants";
import { ipfsToUrl } from "../utils";

interface Image {
  assetID: string;
}

export default function CollectionImage(props: Image) {
  const [url, setUrl] = useState<string>("./images/loading.gif");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${ALGONODE_IDX_NODE_URL}/assets/${props.assetID}`
        );
        const data = response.data;
        const url = await ipfsToUrl(
          data.asset.params.url,
          data.asset.params.reserve
        );
        setUrl(url);
      } catch (error) {
        console.error("Error fetching asset:", error);
      }
    };

    fetchData();
  }, [props.assetID]);

  return (
    <img
      src={url}
      alt={props.assetID}
      className="h-64 rounded-lg mb-2 transition-all mx-auto aspect-square"
    />
  );
}
