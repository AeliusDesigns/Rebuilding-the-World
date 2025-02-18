const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

app.post("/github-webhook", (req, res) => {
  if (req.headers["x-github-event"] === "push") {
    console.log("Received push event from GitHub, pulling changes...");
    exec("git pull origin main && npm install", (err, stdout, stderr) => {
      if (err) {
        console.error(`Error: ${stderr}`);
        return res.sendStatus(500);
      }
      console.log(stdout);
      res.sendStatus(200);
    });
  }
});

app.listen(3000, () => console.log("Webhook listener running on port 3000"));
