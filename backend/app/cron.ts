import { CronJob } from "cron";
import { updateHolders } from "./utils.js";

export const updateHoldersCron = new CronJob(process.env.CRON_EXPRESSION || "0 */12 * * *", async () => {
  try {
    console.log("Running updateHoldersCron");
    await updateHolders();
  } catch (error) {
    console.log("CRITICAL ERROR: updateHoldersCron failed");
    console.log(error);
  }
});
