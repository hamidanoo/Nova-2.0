/**
 * Wanted Poster Command
 * Creates a Western-style wanted poster with user's profile picture
 */

const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const config = require('../../config');

module.exports = {
  name: 'wanted',
  aliases: ['poster'],
  category: 'general',
  description: 'Create a wanted poster with user profile picture',
  usage: '.wanted (reply or @tag or self)',

  async execute(sock, msg, args, extra) {
    try {
      await extra.reply('🎨 Creating wanted poster...');

      // ── Determine target user ──
      let targetJid = extra.sender;
      const ctx = msg.message?.extendedTextMessage?.contextInfo;
      if (ctx?.quotedMessage)          targetJid = ctx.participant;
      else if (ctx?.mentionedJid?.[0]) targetJid = ctx.mentionedJid[0];

      const number = targetJid.split('@')[0];

      // ── Fetch profile picture ──
      let ppBuffer = null;
      try {
        const ppUrl = await sock.profilePictureUrl(targetJid, 'image');
        const res   = await axios.get(ppUrl, { responseType: 'arraybuffer' });
        ppBuffer    = Buffer.from(res.data);
      } catch { /* no DP — fallback handled below */ }

      // ── Canvas setup ──
      // Taller canvas so bottom text never gets cut
      const W = 540, H = 780;
      const canvas = createCanvas(W, H);
      const c      = canvas.getContext('2d');

      // Aged-paper background
      const bg = c.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0,   '#d4a95a');
      bg.addColorStop(0.5, '#c49040');
      bg.addColorStop(1,   '#a0722a');
      c.fillStyle = bg;
      c.fillRect(0, 0, W, H);

      // Paper-grain texture
      c.save();
      for (let i = 0; i < 5000; i++) {
        c.fillStyle = `rgba(0,0,0,${Math.random() * 0.035})`;
        c.fillRect(Math.random() * W, Math.random() * H, 1, 1);
      }
      c.restore();

      // Double border
      c.strokeStyle = '#3a1a00';
      c.lineWidth   = 14;
      c.strokeRect(10, 10, W - 20, H - 20);
      c.lineWidth   = 3;
      c.strokeRect(24, 24, W - 48, H - 48);

      // ── WANTED ──
      c.textAlign    = 'center';
      c.textBaseline = 'top';
      c.font         = 'bold 96px serif';
      c.fillStyle    = 'rgba(0,0,0,0.25)';
      c.fillText('WANTED', W / 2 + 4, 40);
      c.fillStyle    = '#1a0800';
      c.fillText('WANTED', W / 2, 36);

      // ── DEAD OR ALIVE ──
      c.font      = 'bold 28px serif';
      c.fillStyle = '#5a1a00';
      c.fillText('D E A D   O R   A L I V E', W / 2, 144);

      // Divider
      c.strokeStyle = '#3a1a00';
      c.lineWidth   = 2;
      c.beginPath(); c.moveTo(44, 184); c.lineTo(W - 44, 184); c.stroke();

      // ── Photo frame ──
      const IMG_X = 85, IMG_Y = 196, IMG_W = 370, IMG_H = 290;
      // Drop shadow
      c.fillStyle = 'rgba(0,0,0,0.35)';
      c.fillRect(IMG_X + 7, IMG_Y + 7, IMG_W, IMG_H);
      // Border
      c.strokeStyle = '#3a1a00';
      c.lineWidth   = 5;
      c.strokeRect(IMG_X, IMG_Y, IMG_W, IMG_H);

      if (ppBuffer) {
        try {
          const avatar = await loadImage(ppBuffer);
          c.save();
          c.beginPath();
          c.rect(IMG_X, IMG_Y, IMG_W, IMG_H);
          c.clip();
          c.drawImage(avatar, IMG_X, IMG_Y, IMG_W, IMG_H);
          // Sepia tint
          c.fillStyle = 'rgba(120, 60, 0, 0.18)';
          c.fillRect(IMG_X, IMG_Y, IMG_W, IMG_H);
          c.restore();
        } catch {
          ppBuffer = null; // trigger fallback below
        }
      }
      if (!ppBuffer) {
        c.fillStyle = '#8B6914';
        c.fillRect(IMG_X, IMG_Y, IMG_W, IMG_H);
        c.fillStyle    = '#d4a95a';
        c.font         = '90px serif';
        c.textBaseline = 'middle';
        c.fillText('?', W / 2, IMG_Y + IMG_H / 2);
        c.textBaseline = 'top';
      }

      // ── FOR: number ──
      // Fit long numbers by reducing font if needed
      c.font = 'bold 24px serif';
      const forText = `FOR: +${number}`;
      const forMetrics = c.measureText(forText);
      if (forMetrics.width > W - 80) {
        c.font = 'bold 19px serif';
      }
      c.fillStyle    = '#1a0800';
      c.textBaseline = 'top';
      c.fillText(forText, W / 2, IMG_Y + IMG_H + 18);

      // Divider
      c.strokeStyle = '#3a1a00';
      c.lineWidth   = 2;
      const D1Y = IMG_Y + IMG_H + 54;
      c.beginPath(); c.moveTo(44, D1Y); c.lineTo(W - 44, D1Y); c.stroke();

      // ── REWARD ──
      c.font      = 'bold 40px serif';
      c.fillStyle = '#1a0800';
      c.fillText('REWARD', W / 2, D1Y + 10);

      c.font      = 'bold 58px serif';
      c.fillStyle = '#5a1a00';
      c.fillText('$10,000', W / 2, D1Y + 58);

      // Divider
      const D2Y = D1Y + 130;
      c.strokeStyle = '#3a1a00';
      c.lineWidth   = 2;
      c.beginPath(); c.moveTo(44, D2Y); c.lineTo(W - 44, D2Y); c.stroke();

      // ── DANGEROUS — broken into 2 lines so it never clips ──
      c.font      = 'bold 17px serif';
      c.fillStyle = '#3a1a00';
      c.fillText('Extremely dangerous ⚠️', W / 2, D2Y + 7);
      c.fillText('Do not approach  ⚠️',    W / 2, D2Y + 27);

      // ── Footer ──
      c.font      = '13px serif';
      c.fillStyle = '#5a3010';
      c.fillText(`Issued by ${config.botName}`,      W / 2, H - 62);
      c.fillText("Department of higher security", W / 2, H - 48);

      // Bottom ornament line
      c.strokeStyle = '#3a1a00';
      c.lineWidth   = 1;
      c.beginPath(); c.moveTo(44, H - 30); c.lineTo(W - 44, H - 30); c.stroke();
      c.font      = '11px serif';
      c.fillStyle = '#7a4010';
      c.fillText('✦  OFFICIAL NOTICE  ✦', W / 2, H - 18);

      // ── Export ──
      const buffer = canvas.toBuffer('image/jpeg', { quality: 0.93 });

      await sock.sendMessage(extra.from, {
        image: buffer,
        caption: `*WANTED POSTER 🤠*\n\nSuspect 👤: @${number}\nReward 💰: $10,000\nConsidered extremely dangerous ⚠️\n\n> Powered by *${config.botName}*`,
        mentions: [targetJid]
      }, { quoted: msg });

    } catch (error) {
      console.error('Wanted command error:', error);
      await extra.reply('❌ Failed to create wanted poster. Please try again.');
    }
  }
};