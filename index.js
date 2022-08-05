const express = require("express");
const app = express();
const port = process.env.PORT || "5000";
var cors = require("cors");
const bodyParser = require("body-parser");
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const accountSid = "ACc578cc0a5eb1e28718a3c9f67d9a5153";
const authToken = "2319b2150eb49810e5610c868f21e715";
const client = require("twilio")(accountSid, authToken);

app.get("/", (req, res) => {
  res.send(`Welcome to Twilio Message Service`);
});

app.get("/send-sms", (req, res) => {
  const { recipient, name } = req.query;
  let response;
  try {
    client.messages
      .create({
        body: `Hello ${name} welcome! We are happy to have you onboard, Konnect helps you stay connected with your friends.`,
        messagingServiceSid: "MG77cab241bb6ecc8a9b9b3f5bde325d73",
        to: recipient,
      })
      .then((message) => {
        console.log(message);
        console.log(" Phone Number:" + recipient);
        response = message;
      })
      .done();
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

app.post("/send-otp", async (req, res) => {
  let status, error;
  const { phoneNumber } = req.body;
  try {
    client.verify.v2
      .services("VA569572cc938951e261304f8fb472eb20")
      .verifications.create({ to: phoneNumber, channel: "sms" })
      .then((verification) => {
        console.log(verification.status);
        status = verification.status;
        res.send("verification status: " + verification_check.status);
      });
  } catch (error) {
    console.log(error);
    status = "Failure";
  }
  res.json({ error, status });
});

app.post("/verify-otp", async (req, res) => {
  let status, error;
  const { phoneNumber, otp } = req.body;
  try {
    client.verify.v2
      .services("VA569572cc938951e261304f8fb472eb20")
      .verificationChecks.create({ to: phoneNumber, code: otp })
      .then((verification_check) => console.log(verification_check.status));
    res.send("verification status: " + verification_check.status);
  } catch (error) {
    console.log(error);
    status = "Failure";
  }
  res.json({ error, status });
});

app.post('/add-user', async (req, res) => {
  let status, error;
  const {phoneNumber} = req.body;
  try{
      client.validationRequests
      .create({friendlyName: 'My Home Phone Number', phoneNumber: phoneNumber})
      .then(validation_request => {
          console.log(validation_request.friendlyName);
          console.log(validation_request);
      });
  }catch(error){
      console.log(error);
      status = 'Failure';
  }
  res.json({error, status});
})

app.listen(port, () => console.log(`Server started on Port ${port}`));
