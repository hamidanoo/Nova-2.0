/**
 * Facebook Downloader - FINAL (No corruption, WhatsApp compatible)
 */

const { facebookdl } = require('@bochilteam/scraper-facebook')
const axios = require('axios')
const config = require('../../config')
const fs = require('fs')
const { exec } = require('child_process')

const processedMessages = new Set()

async function resolveFacebookUrl(url) {
  try {
    const res = await axios.get(url, {
      maxRedirects: 5,
      timeout: 20000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    return res.request?.res?.responseUrl || url
  } catch {
    return url
  }
}

function runFFmpeg(input, output) {
  return new Promise((resolve, reject) => {
    exec(`ffmpeg -y -i ${input} -c:v libx264 -c:a aac -movflags +faststart ${output}`, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

module.exports = {
  name: 'facebook',
  aliases: ['fb', 'fbdl'],
  
  async execute(sock, msg, args, extra) {
    try {
      if (processedMessages.has(msg.key.id)) return
      processedMessages.add(msg.key.id)
      setTimeout(() => processedMessages.delete(msg.key.id), 5 * 60 * 1000)

      const text = msg.message?.conversation ||
                   msg.message?.extendedTextMessage?.text ||
                   args.join(' ')

      if (!text) return extra.reply('❌ Provide a Facebook link')

      let url = text.split(' ').slice(1).join(' ').trim()
      if (!url) return extra.reply('❌ Provide a Facebook link')

      if (!/(facebook\.com|fb\.watch)/i.test(url)) {
        return extra.reply('❌ Invalid Facebook link')
      }

      await sock.sendMessage(extra.from, {
        react: { text: '🔄', key: msg.key }
      })

      url = await resolveFacebookUrl(url)

      let videoUrl = null

      // API
      try {
        const api = `https://api.princetechn.com/api/download/facebook?apikey=prince&url=${encodeURIComponent(url)}`
        const res = await axios.get(api)

        if (res.data?.result) {
          videoUrl = res.data.result.sd_video || res.data.result.hd_video
        }
      } catch {}

      // fallback scraper
      if (!videoUrl) {
        try {
          const data = await facebookdl(url)

          if (data?.video?.length > 0) {
            const dl = await data.video[0].download()
            videoUrl = typeof dl === 'string' ? dl : dl.url
          }
        } catch {}
      }

      if (!videoUrl) {
        return extra.reply('❌ Unable to fetch video')
      }

      // download buffer
      const res = await axios.get(videoUrl, {
        responseType: 'arraybuffer',
        timeout: 60000
      })

      const inputFile = 'input.mp4'
      const outputFile = 'output.mp4'

      fs.writeFileSync(inputFile, Buffer.from(res.data))

      // 🔥 MAIN FIX (re-encode)
      await runFFmpeg(inputFile, outputFile)

      const fixedBuffer = fs.readFileSync(outputFile)

      if (fixedBuffer.length > 20 * 1024 * 1024) {
        fs.unlinkSync(inputFile)
        fs.unlinkSync(outputFile)
        return extra.reply('❌ Video too large')
      }

      const botName = config.botName.toUpperCase()

      await sock.sendMessage(extra.from, {
        video: fixedBuffer,
        mimetype: 'video/mp4',
        caption: `*DOWNLOADED BY ${botName}*`
      }, { quoted: msg })

      fs.unlinkSync(inputFile)
      fs.unlinkSync(outputFile)

    } catch (err) {
      console.error(err)
      extra.reply('❌ Error while processing request')
    }
  }
}
