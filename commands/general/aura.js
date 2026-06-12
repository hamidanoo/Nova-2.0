const auraMap = [
  { min: 0, text: "bhai tera aura negative me ja raha, WiFi bhi disconnect ho gaya 💀" },
  { min: 3, text: "log tujhe dekh ke apni energy save mode pe daal dete 😭" },
  { min: 6, text: "tera vibe dekh ke plants bhi murjha jate hain 🥀" },
  { min: 9, text: "system error: personality not found 💀" },
  { min: 12, text: "tu enter hota hai aur mahaul kharab ho jata 😭" },
  { min: 15, text: "bhai tu walking disappointment lagta hai 😂" },
  { min: 18, text: "tera aura low battery warning de raha ⚠️" },
  { min: 21, text: "vibe itni weak ke shadow bhi chor jaye 💀" },
  { min: 24, text: "bhai tu background NPC jesa feel deta 😭" },
  { min: 27, text: "log tujhe mute pe daal ke ignore karte 😂" },
  { min: 30, text: "thoda sa improvement hai, lekin abhi bhi risky zone 😬" },

  { min: 33, text: "tu theek hai lekin special kuch nahi 😐" },
  { min: 36, text: "average banda, average vibes 😶" },
  { min: 39, text: "kabhi achha kabhi ajeeb mood swings 😭" },
  { min: 42, text: "thodi personality hai lekin stable nahi 😅" },
  { min: 45, text: "log tolerate kar lete hain bas 😏" },
  { min: 48, text: "vibe ok hai lekin impact weak 😶" },
  { min: 51, text: "ab thoda improve ho raha hai 😎" },
  { min: 54, text: "presence noticeable hai 👀" },
  { min: 57, text: "log ab ignore nahi karte 😏" },
  { min: 60, text: "solid banda ban raha hai 🔥" },
  { min: 63, text: "confidence build ho raha clearly 😎" },
  { min: 66, text: "ab tu thoda main character lag raha 😏" },
  { min: 69, text: "almost strong aura, bas thoda push aur 💯" },

  { min: 72, text: "tu enter kare to log automatically notice karein, presence strong ho rahi 🔥" },
  { min: 75, text: "confidence aur vibe dono align ho rahe, tu ab impact create kar raha 💯" },
  { min: 78, text: "log tujhe serious lena shuru kar dete, aura clean aur sharp hai 😎" },
  { min: 81, text: "tu jahan khara ho wahan environment shift ho jata, energy high level pe hai ⚡" },
  { min: 84, text: "strong personality, log naturally attract ho rahe bina try kiye 🔥" },
  { min: 87, text: "tu conversation control karta hai, dominance clear feel hoti 💯" },
  { min: 90, text: "high value aura, respect automatically mil raha bina demand ke 👑" },
  { min: 93, text: "tu rare category me aa raha, presence memorable aur powerful 💎" },
  { min: 96, text: "elite level energy, log tujhe ignore kar hi nahi sakte 🔥" },
  { min: 99, text: "top tier aura, tu jahan jaye wahan impact leave karta 💯" },
  { min: 100, text: "legend status unlocked, tu khud ek vibe nahi pura environment hai 👑🔥" }
];

function getAuraText(percent) {
  let result = auraMap[0].text;
  for (let i = 0; i < auraMap.length; i++) {
    if (percent >= auraMap[i].min) {
      result = auraMap[i].text;
    }
  }
  return result;
}

module.exports = {
  name: "aura",
  category: "general",

  async execute(sock, msg, args, extra) {
    try {
      const chatId = extra.from;

      const mentioned =
        msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

      if (mentioned.length < 1) {
        return extra.reply("❌ Kisi user ko tag karo\nExample: .aura @user");
      }

      const user = mentioned[0];

      const aura = Math.floor(Math.random() * 101);
      const text = getAuraText(aura);

      // ⏳ Loading
      const steps = [
  "█░░░░░░░░░ 10%",
  "██░░░░░░░░ 20%",
  "███░░░░░░░ 30%",
  "████░░░░░░ 40%",
  "█████░░░░░ 50%",
  "██████░░░░ 60%",
  "███████░░░ 70%",
  "████████░░ 80%",
  "█████████░ 90%",
  "██████████ 100%",
];

// first message
let msgKey = await sock.sendMessage(chatId, {
  text: "🧠 Scanning aura...\n[░░░░░░░░░░ 0%]"
}, { quoted: msg });

// animation loop
for (let i = 0; i < steps.length; i++) {
  await new Promise(r => setTimeout(r, 500));

  await sock.sendMessage(chatId, {
    text: `🧠 Scanning aura...\n[${steps[i]}]`,
    edit: msgKey.key   // ⚠️ yahan .key important hai
  });
}
  

      // 🎯 Final output
      const result = `┏━━〔 ⚡ AURA SCAN SYSTEM 〕━━┓
┃ 👤 User: @${user.split("@")[0]}
┃ 📊 Aura Level: ${aura}%
┣━━━━━━━━━━━━━━━━━━━━━━━
💬 ${text}
┗━━━━━━━━━━━━━━━━━━━━━━━┛

> Powered by Nazawali`;

      await sock.sendMessage(chatId, {
        text: result,
        mentions: [user]
      }, { quoted: msg });

    } catch (err) {
      console.log(err);
      extra.reply("❌ Error in aura command");
    }
  }
};