import { useEffect, useState } from "react";
import CollectionImage from "../components/collectionImage";
import axios from "axios";
import { BASE_FRONTEND_URL } from "../constants";
import { ProjectsResponse } from "../types";
import slugify from "slugify";
import { Link } from "react-router-dom";

export default function Collections() {
  const [collections, setCollections] = useState<ProjectsResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Collections | AlgoVerify";

    const getCollections = async () => {
      const response = await axios.get<ProjectsResponse[]>(
        `${BASE_FRONTEND_URL}/api/projects`
      );
      const data = response.data;
      setCollections(data);
      setLoading(false);
    };

    getCollections();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-900">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        ></div>
      </div>
    );
  }

  return (
    <div className="text-center bg-gray-900 flex flex-col min-h-screen justify-between text-white">
      <p className="text-5xl font-semibold pb-4 pt-8 hover:text-slate-400 transition">
        Collections
      </p>
      <div className="flex flex-wrap w-fit font-normal mx-auto justify-center min-w-0 max-w-fit mt-4 gap-4 min-h-fit pb-20">
        {collections
          .sort((a, b) => a.id - b.id)
          .map((c) => (
            <a
              href={`/collection/${c.id}#${slugify(c.name)}`}
              key={c.featuredAsset}
            >
              <div className="group">
                <div className="w-full mx-auto px-3 pt-3 text-left brightness-[0.90] hover:brightness-100 bg-cyan-900 cursor-pointer shadow-sm hover:shadow-xl hover:text-slate-50 text-slate-200 transition-all rounded-xl">
                  <div>
                    <CollectionImage assetID={c.featuredAsset.toString()} />
                    <div className="mx-auto pb-2 w-max">
                      <p className="font-semibold my-auto text-2xl">{c.name}</p>
                      <p className="text-sm text-center">{c.creatorName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
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
  );
}
