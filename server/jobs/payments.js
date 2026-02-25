const cron = require("node-cron");
const dayjs = require("dayjs");
const sellersModel = require("../models/sellers");

cron.schedule("0 0 * * *", async () => {
    const now = new Date();

    const expired = await sellersModel.find({
        "planDetails.endDate": { $lt: now },
        "planDetails.subscriptionStatus": "active"
    });

    for (const s of expired) {
        const graceEnd = dayjs(s.planDetails.endDate).add(3, "day");

        if (dayjs().isAfter(graceEnd)) {
            // s.planDetails.subscriptionStatus = "expired";
            s.planDetails.subscriptionStatus = "inactive";
            await s.save();
        }
        // else{
        //     // s.planDetails.subscriptionStatus = "trial";
        //     await s.save();
        // }
    }
});

