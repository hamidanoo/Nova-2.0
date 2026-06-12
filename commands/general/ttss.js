const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const CVOICE_API_KEY = 'cvai_f78f89ecd605dfbc1c5be53d101b6dd3b1991113b34147e1';
const VOICE_ID       = 'a9f9030d-0574-48bf-abb9-95a1b81b6cc0';

module.exports = {
  name: 'ttss',
  aliases: ['iktts'],
  category: 'general',

  async execute(sock, msg, args, extra) {
    try {
      const text = args.join(' ');

      if (!text) return extra.reply("Example: .ttss Pakistan Zindabad");

      console.log("🚀 cvoice.ai request start...");

      // Step 1: Audio URL lo cvoice.ai se
      const { data } = await axios.post(
        'https://cvoice.ai/api/tts',
        { voice_id: VOICE_ID, text: text },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': CVOICE_API_KEY
          }
        }
      );

      if (!data?.url) throw new Error('No audio URL returned');

      console.log("✅ cvoice.ai SUCCESS, URL:", data.url);

      // Step 2: MP3 download karo
      const audioRes = await axios.get(data.url, { responseType: 'arraybuffer' });

      // Step 3: Temp files
      const tmpMp3 = path.join('/tmp', `ttss_${Date.now()}.mp3`);
      const tmpOgg = path.join('/tmp', `ttss_${Date.now()}.ogg`);

      fs.writeFileSync(tmpMp3, Buffer.from(audioRes.data));

      // Step 4: MP3 → OGG Opus (WhatsApp PTT format)
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

      // Step 5: OGG read karo
      const oggBuffer = fs.readFileSync(tmpOgg);

      // Step 6: WhatsApp PTT voice note bhejo
      await sock.sendMessage(extra.from, {
        audio: oggBuffer,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
      }, { quoted: msg });

      // Step 7: Cleanup
      fs.unlinkSync(tmpMp3);
      fs.unlinkSync(tmpOgg);

      console.log("✅ TTSS voice note sent!");

    } catch (err) {
      console.log("❌ ERROR:", err.response?.data || err.message);
      extra.reply("❌ TTS failed. Please try again.");
    }
  }
};