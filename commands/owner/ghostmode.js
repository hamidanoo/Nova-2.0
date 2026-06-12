const fs = require("fs");

module.exports = {
  name: "ghostmode",
  category: "owner",
  ownerOnly: true,

  async execute(sock, msg, args, { reply }) {
    const path = "./data/ghost.json";

    let config = { enabled: false };

    if (fs.existsSync(path)) {
      config = JSON.parse(fs.readFileSync(path));
    }

    if (args[0] === "on") config.enabled = true;
    else if (args[0] === "off") config.enabled = false;
    else return reply("Use: .ghostmode on/off");

    fs.writeFileSync(path, JSON.stringify(config, null, 2));

    reply(`👻 GhostMode ${config.enabled ? "ON" : "OFF"}`);
  }
};