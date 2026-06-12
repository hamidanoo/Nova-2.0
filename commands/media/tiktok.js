/**
 * TikTok Downloader - Fully Fixed with Multi API Fallback
 */

const { ttdl } = require('ruhend-scraper');
const axios = require('axios');
const config = require('../../config');

// Store processed message IDs to prevent duplicates
const processedMessages = new Set();

module.exports = {
  name: 'tiktok',
  aliases: ['tt', 'ttdl', 'tiktokdl'],
  category: 'media',
  description: 'Download TikTok videos',
  usage: '.tiktok <TikTok URL>',
  
  async execute(sock, msg, args) {
    try {
      if (processedMessages.has(msg.key.id)) return;

      processedMessages.add(msg.key.id);
      setTimeout(() => {
        processedMessages.delete(msg.key.id);
      }, 5 * 60 * 1000);

      const text = msg.message?.conversation || 
                   msg.message?.extendedTextMessage?.text ||
                   args.join(' ');

      if (!text) {
        return await sock.sendMessage(msg.key.remoteJid, { 
          text: 'Provide TikTok link.' 
        }, { quoted: msg });
      }

      const url = text.split(' ').slice(1).join(' ').trim();

      if (!url) {
        return await sock.sendMessage(msg.key.remoteJid, { 
          text: 'Provide TikTok link.' 
        }, { quoted: msg });
      }

      const tiktokPatterns = [
        /https?:\/\/(?:www\.)?tiktok\.com\//,
        /https?:\/\/(?:vm\.)?tiktok\.com\//,
        /https?:\/\/(?:vt\.)?tiktok\.com\//
      ];

      if (!tiktokPatterns.some(p => p.test(url))) {
        return await sock.sendMessage(msg.key.remoteJid, { 
          text: 'Invalid TikTok link.' 
        }, { quoted: msg });
      }

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: '🔄', key: msg.key }
      });

      let videoUrl = null;
      let title = null;

      // 🔥 MULTI API FALLBACK
      const apiList = [
        `https://api.princetechn.com/api/download/tiktok?apikey=prince&url=${encodeURIComponent(url)}`,
        `https://api.princetechn.com/api/download/tiktokdlv2?apikey=prince&url=${encodeURIComponent(url)}`,
        `https://api.princetechn.com/api/download/tiktokdlv3?apikey=prince&url=${encodeURIComponent(url)}`,
        `https://api.princetechn.com/api/download/tiktokdlv4?apikey=prince&url=${encodeURIComponent(url)}`,
        `https://api.dreaded.site/api/tiktok?url=${encodeURIComponent(url)}`
      ];

      for (let api of apiList) {
        try {
          const res = await axios.get(api, { timeout: 15000 });
          const data = res.data;

          videoUrl =
            data?.video ||
            data?.videoUrl ||
            data?.data?.play ||
            data?.data?.video ||
            data?.result?.video ||
            data?.result?.nowm;

          title =
            data?.title ||
            data?.data?.title ||
            data?.result?.title ||
            null;

          if (videoUrl) {
            console.log(`✅ API WORKED: ${api}`);
            break;
          }

        } catch (err) {
          console.log(`❌ API FAILED: ${api}`);
        }
      }

      // 🔁 SCRAPER FALLBACK
      if (!videoUrl) {
        try {
          let downloadData = await ttdl(url);

          if (downloadData?.data?.length > 0) {
            for (let media of downloadData.data) {
              if (media.type === 'video') {
                await sock.sendMessage(msg.key.remoteJid, {
                  video: { url: media.url },
                  mimetype: 'video/mp4',
                  caption: `*DOWNLOADED BY ${config.botName.toUpperCase()}*`
                }, { quoted: msg });
              } else {
                await sock.sendMessage(msg.key.remoteJid, {
                  image: { url: media.url }
                }, { quoted: msg });
              }
            }
            return;
          }
        } catch (e) {
          console.log('❌ Scraper failed');
        }
      }

      if (!videoUrl) {
        return await sock.sendMessage(msg.key.remoteJid, { 
          text: '❌ All methods failed.' 
        }, { quoted: msg });
      }

      // 🚀 SEND VIDEO
      try {
        const res = await axios.get(videoUrl, {
          responseType: 'arraybuffer',
          timeout: 60000
        });

        const buffer = Buffer.from(res.data);

        await sock.sendMessage(msg.key.remoteJid, {
          video: buffer,
          mimetype: 'video/mp4',
          caption: title 
            ? `*DOWNLOADED BY ${config.botName.toUpperCase()}*\n\n${title}`
            : `*DOWNLOADED BY ${config.botName.toUpperCase()}*`
        }, { quoted: msg });

      } catch {
        // fallback direct URL send
        await sock.sendMessage(msg.key.remoteJid, {
          video: { url: videoUrl },
          mimetype: 'video/mp4',
          caption: `*DOWNLOADED BY ${config.botName.toUpperCase()}*`
        }, { quoted: msg });
      }

    } catch (err) {
      console.error(err);
      await sock.sendMessage(msg.key.remoteJid, { 
        text: 'Error occurred.' 
      }, { quoted: msg });
    }
  }
};