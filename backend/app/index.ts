import cors from "cors";
import express, { Express } from "express";

import morgan from "morgan";
import { DISCORD_TOKEN, PORT } from "./constants.js";
import { client } from "./discord/client.js";
import { errorHandler } from "./middlewares.js";
import verifyRouter from "./routes/verify.js";
import './polyfills.js';
import AdminJSExpress from "@adminjs/express";
import { Database, Resource, getModelByName } from "@adminjs/prisma";
import AdminJS from "adminjs";
import prisma from "../prisma/client.js";
import { updateHoldersCron } from "./cron.js";


AdminJS.registerAdapter({ Database, Resource });

const app: Express = express();
app.set("trust proxy", process.env.REVERSE_PROXY_COUNT);

const admin = new AdminJS({
  resources: [
    {
      resource: { model: getModelByName("Project"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("ProjectAssets"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("BlacklistedAsset"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("CreatorWallet"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("User"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("UserWallet"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("Application"), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName("Uuid"), client: prisma },
      options: {},
    },
  ],
});

updateHoldersCron.start();

admin.options.rootPath = "/panel";
const router = AdminJSExpress.buildRouter(admin);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(errorHandler);
app.use(admin.options.rootPath, router);
app.use("/api", verifyRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

client.login(DISCORD_TOKEN);
