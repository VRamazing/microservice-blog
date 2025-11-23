const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const PORT = 4005;
const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const event = req.body;
  const services = [
    "http://localhost:4000/events",
    "http://localhost:4001/events",
    "http://localhost:4002/events",
    "http://localhost:4003/events",
  ];

  await Promise.all(
    services.map((url) =>
      axios.post(url, event).catch((err) => {
        console.log(`Error posting to ${url}: ${err.message}`);
      })
    )
  );

  res.send({ status: "OK" });
});

app.listen(PORT, () => {
    console.log(`Event bus Listening on ${PORT}`);
})
