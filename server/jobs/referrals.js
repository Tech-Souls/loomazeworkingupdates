const cron = require("node-cron");
const { createMonthlyEarningsForMonth } = require("../services/referral");



async function runMonthlyJobForCurrentMonth() {
    try {
        const now = new Date();
        const monthKey = now.toISOString().slice(0, 7);
        console.log(`[referralCron] running monthly job for ${monthKey}`);
        await createMonthlyEarningsForMonth(monthKey);
        console.log("[referralCron] done");
    } catch (err) {
        console.error("[referralCron] error", err);
    }
}

const scheduleMonthlyReferralJob = () => {
    cron.schedule("5 0 * * *", async () => {
    // cron.schedule("* * * * *", async () => {
        await runMonthlyJobForCurrentMonth();
    }, { timezone: "UTC" });
};

module.exports = scheduleMonthlyReferralJob;