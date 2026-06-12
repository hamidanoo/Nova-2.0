const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const ELEVEN_API = "sk_347141674d1b49d85f82e684cddd7a10c26576ad7aaab540";
const VOICE_ID = "dNA3PzFiQpUuAJFMC0lu";

module.exports = {
  name: 'tts',
  aliases: ['speak', 'say'],
  category: 'general',

  async execute(sock, msg, args, extra) {
    try {
      const chatId = extra.from;
      const text = args.join(' ');

      if (!text) return extra.reply("Example: .tts hello bro");

      console.log("🚀 ElevenLabs request start...");

      // Step 1: Get MP3 audio from ElevenLabs
      const res = await axios({
        method: "POST",
        url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        headers: {
          "xi-api-key": ELEVEN_API,
          "Content-Type": "application/json"
        },
        data: {
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.8
          }
        },
        responseType: "arraybuffer"
      });

      console.log("✅ ElevenLabs SUCCESS:", res.status);

      // Step 2: Save MP3 to temp file
      const tmpMp3 = path.join('/tmp', `tts_${Date.now()}.mp3`);
      const tmpOgg = path.join('/tmp', `tts_${Date.now()}.ogg`);

      fs.writeFileSync(tmpMp3, Buffer.from(res.data));

      // Step 3: Convert MP3 → OGG Opus using ffmpeg (WhatsApp PTT format)
      await new Promise((resolve, reject) => {
        exec(
          `ffmpeg -y -i "${tmpMp3}" -c:a libopus -b:a 128k -vbr on -ar 48000 "${tmpOgg}"`,
          (error, stdout, stderr) => {
            if (error) {
              console.log("❌ ffmpeg error:", stderr);
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });

      // Step 4: Read converted OGG file
      const oggBuffer = fs.readFileSync(tmpOgg);

      // Step 5: Send as WhatsApp PTT voice note
      await sock.sendMessage(chatId, {
        audio: oggBuffer,
        mimetype: 'audio/ogg; codecs=opus', // ✅ Correct WhatsApp PTT format
        ptt: true
      }, { quoted: msg });

      // Step 6: Cleanup temp files
      fs.unlinkSync(tmpMp3);
      fs.unlinkSync(tmpOgg);

      console.log("✅ TTS voice note sent successfully!");

    } catch (err) {
      console.log("❌ ERROR:", err.response?.data || err.message);
      extra.reply("❌ TTS failed. Please try again.");
    }
  }
};