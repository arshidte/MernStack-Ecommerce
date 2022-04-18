import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import twilio from "twilio";
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

let mobileNum;
router.post("/request", async (req, res) => {
  mobileNum = req.body.mobile;
  const result = await client.verify
    .services(process.env.TWILIO_SERVICE_SID)
    .verifications.create({
      to: `+91${req.body.mobile}`,
      channel: "sms",
    });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404);
    throw new Error("Please enter a valid mobile number");
  }
});

router.post("/send", (req, res) => {
  const { otp } = req.body;
  client.verify
    .services(process.env.TWILIO_SERVICE_SID)
    .verificationChecks.create({
      to: `+91${mobileNum}`,
      code: otp,
    })
    .then((response) => {
      if (response.status === "approved") {
        res.status(200).json({ messsage: "Your mobile has approved." });
      }
    })
    .catch((error) => {
      res.status(404);
      throw new Error(error);
    });
});

export default router;
