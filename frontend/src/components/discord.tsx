import axios from "axios";
import { useEffect, useState } from "react";
import { DISCORD_CALLBACK_URL } from "../constants";

export default function Discord() {
  const URL = DISCORD_CALLBACK_URL;
  const [token, setToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [discordId, setDiscordId] = useState("");

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");
    if (accessToken) {
      setToken(accessToken);
      setIsConnected(true);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const res = await axios.get("https://discordapp.com/api/users/@me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = res.data;
          setUsername(data.username);
          setAvatar(data.avatar);
          setDiscordId(data.id);
        } catch (error) {
          console.error("Error fetching user data from Discord:", error);
        }
      }
    };

    fetchUserData();
  }, [token]);

  return (
    <div>
      {isConnected && (
        <button className="bg-purple-800 justify-center flex px-6 py-2 text-lg sm:text-xl font-bold cursor-default text-slate-50 shadow-md hover:shadow-none transition-all rounded mx-auto">
          <img
            src={`https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png`}
            alt={username}
            className="h-12 w-12 rounded-full mr-2"
          />
          <a href={URL} className="text-center my-auto">
            {username}
          </a>
        </button>
      )}
      {!isConnected && (
        <div>
          <a href={URL}>
            <button className="bg-purple-800 px-6 py-2 text-lg sm:text-xl font-bold text-slate-50 hover:text-slate-100 hover:bg-purple-900 shadow-md hover:shadow-none transition-all rounded">
              <span>Connect Discord</span>
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
