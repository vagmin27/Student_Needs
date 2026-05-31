import cron from "node-cron";
import Application from "../../models/Referrals/ApplicationModel.js";

// Daily cleanup task at midnight
export const archiveCleanupScheduler = () => {
  if (process.env.NODE_ENV !== "production" && process.env.ENABLE_SCHEDULERS !== "true") {
    return;
  }
  
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("🧹 Running daily candidate application archive cleanup...");
      const now = new Date();
      const result = await Application.updateMany(
        {
          archiveAt: { $lte: now },
          archived: false
        },
        {
          $set: { archived: true }
        }
      );
      console.log(`✅ Cleaned up and archived ${result.modifiedCount} applications.`);
    } catch (error) {
      console.error("❌ Candidate archival cleanup task failed:", error.message);
    }
  });
};
