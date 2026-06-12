const config = require('../../config');

const {
  downloadContentFromMessage
} = require('@whiskeysockets/baileys');

const {
  normalizeJidWithLid
} = require('../../handler');

module.exports = {
  name: 'viewonce',
  aliases: ['??'],
  category: 'owner',
  description: '',
  usage: '.??',
  ownerOnly: true,

  async execute(sock, msg, args) {

    try {

      const chatId =
        msg.key.remoteJid;

      // OWNER DM
      const owner =
        config.ownerNumber[0]
          .includes("@")
            ? config.ownerNumber[0]
            : config.ownerNumber[0] +
              "@s.whatsapp.net";

      // CONTEXT
      const ctx =
        msg.message?.extendedTextMessage
          ?.contextInfo ||
        msg.message?.imageMessage
          ?.contextInfo ||
        msg.message?.videoMessage
          ?.contextInfo ||
        msg.message?.buttonsResponseMessage
          ?.contextInfo ||
        msg.message?.listResponseMessage
          ?.contextInfo;

      if (
        !ctx?.quotedMessage ||
        !ctx?.stanzaId
      ) {

        return;

      }

      const quotedMsg =
        ctx.quotedMessage;

      // CHECK VIEWONCE
      const hasViewOnce =
        !!quotedMsg.viewOnceMessageV2 ||
        !!quotedMsg.viewOnceMessageV2Extension ||
        !!quotedMsg.viewOnceMessage ||
        !!quotedMsg.viewOnce ||
        !!quotedMsg?.imageMessage
          ?.viewOnce ||
        !!quotedMsg?.videoMessage
          ?.viewOnce ||
        !!quotedMsg?.audioMessage
          ?.viewOnce;

      if (!hasViewOnce) {
        return;
      }

      let actualMsg = null;
      let mtype = null;

      // VIEWONCE V2 EXTENSION
      if (
        quotedMsg
          .viewOnceMessageV2Extension
          ?.message
      ) {

        actualMsg =
          quotedMsg
            .viewOnceMessageV2Extension
            .message;

        mtype =
          Object.keys(actualMsg)[0];

      }

      // VIEWONCE V2
      else if (
        quotedMsg
          .viewOnceMessageV2
          ?.message
      ) {

        actualMsg =
          quotedMsg
            .viewOnceMessageV2
            .message;

        mtype =
          Object.keys(actualMsg)[0];

      }

      // OLD VIEWONCE
      else if (
        quotedMsg
          .viewOnceMessage
          ?.message
      ) {

        actualMsg =
          quotedMsg
            .viewOnceMessage
            .message;

        mtype =
          Object.keys(actualMsg)[0];

      }

      // DIRECT IMAGE
      else if (
        quotedMsg
          ?.imageMessage
          ?.viewOnce
      ) {

        actualMsg = {
          imageMessage:
            quotedMsg.imageMessage
        };

        mtype =
          'imageMessage';

      }

      // DIRECT VIDEO
      else if (
        quotedMsg
          ?.videoMessage
          ?.viewOnce
      ) {

        actualMsg = {
          videoMessage:
            quotedMsg.videoMessage
        };

        mtype =
          'videoMessage';

      }

      // DIRECT AUDIO
      else if (
        quotedMsg
          ?.audioMessage
          ?.viewOnce
      ) {

        actualMsg = {
          audioMessage:
            quotedMsg.audioMessage
        };

        mtype =
          'audioMessage';

      }

      if (
        !actualMsg ||
        !mtype
      ) {

        return;

      }

      // DOWNLOAD TYPE
      const downloadType =
        mtype === 'imageMessage'
          ? 'image'
          : mtype === 'videoMessage'
          ? 'video'
          : 'audio';

      // DOWNLOAD
      const mediaStream =
        await downloadContentFromMessage(
          actualMsg[mtype],
          downloadType
        );

      let buffer =
        Buffer.from([]);

      for await (
        const chunk of mediaStream
      ) {

        buffer = Buffer.concat([
          buffer,
          chunk
        ]);

      }

      // CAPTION
      const caption =
        actualMsg[mtype]
          ?.caption || '';

      // GROUP INFO
      let groupName =
        'Private Chat';

      if (
        chatId.endsWith('@g.us')
      ) {

        try {

          const metadata =
            await sock.groupMetadata(
              chatId
            );

          groupName =
            metadata.subject;

        } catch {}

      }

      // SENDER
      let senderJid =
        ctx.participant ||
        ctx.remoteJid ||
        "Unknown";

      try {
        senderJid = normalizeJidWithLid(senderJid);
      } catch {}

      const number = senderJid.split("@")[0];
      const cleanNumber = number.length > 15 ? "Unknown" : number;
      const formattedNumber = cleanNumber === "Unknown" ? "Unknown" : `+${cleanNumber}`;

      const info =
`╭───『 ViewOnce Message 👀 』───╮

👤 User    : @${cleanNumber}
📍 Chat    : ${groupName}

╰━━━━━━━━━━━━━━━━━━━━━━━╯

> Powered by Nazawali ®️`;

      // VIDEO
      if (
        /video/.test(mtype)
      ) {

        await sock.sendMessage(
          owner,
          {
            video: buffer,
            caption:
              info +
              (caption ? '\n\n💬 ' + caption : ''),
            mimetype:
              'video/mp4',
            mentions: [senderJid]
          }
        );

      }

      // IMAGE
      else if (
        /image/.test(mtype)
      ) {

        await sock.sendMessage(
          owner,
          {
            image: buffer,
            caption:
              info +
              (caption ? '\n\n💬 ' + caption : ''),
            mimetype:
              'image/jpeg',
            mentions: [senderJid]
          }
        );

      }

      // AUDIO
      else if (
        /audio/.test(mtype)
      ) {

        await sock.sendMessage(
          owner,
          {
            audio: buffer,
            ptt: true,
            mimetype:
              'audio/ogg; codecs=opus'
          }
        );

        await sock.sendMessage(
          owner,
          {
            text: info,
            mentions: [senderJid]
          }
        );

      }

    } catch (error) {

      console.error(
        'viewonce command error',
        error
      );

    }
  }
};