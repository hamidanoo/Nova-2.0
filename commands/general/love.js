const results = [
  { percent: 0, text: "💀 Bhai ye to dushmani hai" },
  { percent: 5, text: "😂 Naam bhi sath acha nahi lagta" },
  { percent: 10, text: "😬 Friendzone bhi accept nahi karegi" },
  { percent: 15, text: "🥲 Try mat kar insult hoga" },
  { percent: 20, text: "🙃 Bhai rehne de single hi theek hai" },
  { percent: 25, text: "😅 Sirf seen pe chalay ga" },
  { percent: 30, text: "😶 Dosti bhi doubtful hai" },
  { percent: 35, text: "🙂 Thoda chance hai but risky" },
  { percent: 40, text: "😌 Time lagega boss" },
  { percent: 45, text: "😏 Shayad ho jaye kuch" },
  { percent: 50, text: "😎 Half match — try kar sakta hai" },
  { percent: 55, text: "😉 Interest develop ho sakta hai" },
  { percent: 60, text: "😊 Good vibes aa rahi hain" },
  { percent: 65, text: "😍 Cute couple ban sakte ho" },
  { percent: 70, text: "💖 Strong connection lag raha hai" },
  { percent: 75, text: "🔥 Perfect match bro" },
  { percent: 80, text: "💘 Chemistry zabardast hai" },
  { percent: 85, text: "🥰 Love story shuru ho sakti hai" },
  { percent: 90, text: "💍 Rishta pakka samjho" },
  { percent: 100, text: "👑 Rab ne banayi jodi — shaadi karlo" }
];

module.exports = {
  name: "love",
  aliases: ["ship", "match"],
  category: "general",

  async execute(sock, msg, args, extra) {
    try {
      const chatId = extra.from;

      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

      if (mentioned.length < 2) {
        return extra.reply("❌ 2 users tag karo\nExample: .love @user1 @user2");
      }

      // ✔️ Always take first 2 mentioned users
      const user1 = mentioned[0];
      const user2 = mentioned[1];

      const random = results[Math.floor(Math.random() * results.length)];

      await sock.sendPresenceUpdate('composing', chatId);

      setTimeout(async () => {

        const text = `╭───『 💘 LOVE CALCULATOR 』───╮

👤 User 1: @${user1.split("@")[0]}  
👤 User 2: @${user2.split("@")[0]}  

┣━━━━━━━━━━━━━━━━━━━━━━━
💞 Match Level : ${random.percent}%

💬 Status:
${random.text}

╰━━━━━━━━━━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(chatId, {
          text,
          mentions: [user1, user2]
        }, { quoted: msg });

      }, 2000);

    } catch (err) {
      console.log(err);
      extra.reply("❌ Error in love command");
    }
  }
};