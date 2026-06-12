const fs = require("fs");

const CONFIG_PATH = "./data/offline.json";

function load() {
  if (!fs.existsSync(CONFIG_PATH)) return { enabled: false, message: "⚠️ Owner abhi offline hain, thodi der mein reply milega!", lastReplied: {} };
  return JSON.parse(fs.readFileSync(CONFIG_PATH));
}

function save(data) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "offline",
  aliases: ["afk"],
  category: "owner",
  ownerOnly: true,

  async autoReply(sock, msg, from, isGroup) {
    try {
      if (msg.key.fromMe || isGroup) return;
      const config = load();
      if (!config.enabled) return;
      const now = Date.now();
      const cooldown = 60 * 60 * 1000;
      const lastReplied = config.lastReplied || {};
      if ((now - (lastReplied[from] || 0)) < cooldown) return;
      const text = `╭───『 Offline 🔴 』───╮\n\n${config.message}\n\n╰━━━━━━━━━━━━━━━╯\n> Powered by Nazawali ®️`;
      await sock.sendMessage(from, { text });
      lastReplied[from] = now;
      config.lastReplied = lastReplied;
      save(config);
    } catch (e) {}
  },

  async execute(sock, msg, args, { reply }) {
    const config = load();

    if (!args[0]) {
      return reply(`*Offline Mode*\n\nStatus: ${config.enabled ? "On ✅️" : "OFF ❌️"}\nMessage: ${config.message}\n\nUse:\n.offline on\n.offline off\n.offline set <your message>`);
    }

    if (args[0] === "on") {
      config.enabled = true;
      save(config);
      return reply("Offline mode on ✅️.");
    }

    if (args[0] === "off") {
      config.enabled = false;
      save(config);
      return reply("Offline mode off ❌️");
    }

    if (args[0] === "set") {
      const newMsg = args.slice(1).join(" ");
      if (!newMsg) return reply("Write message!\nExample: .offline msg I am currently not available");
      config.message = newMsg;
      save(config);
      return reply(`Message update ✅️\n\n"${newMsg}"`);
    }

    return reply("Use: .offline on / .offline off / .offline set <message>");
  }
};