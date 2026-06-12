/**
 * Global Configuration for WhatsApp MD Bot
 */

module.exports = {
    // Bot Owner Configuration
    ownerNumber: ['923039573226'], // Add your number without + or spaces (e.g., 919876543210)
    ownerName: ['Hamid Shah'], // Owner names corresponding to ownerNumber array
    
    // Bot Configuration
    botName: 'Nova 2.0',
    prefix: '?',
    sessionName: 'session',
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VU25KiSBT8l3rFmEYEESM6YhFRbooKeNuYhxIKKORmVaHihP++Qff09DzsTvS+FYeKPHky89QPUFaYIhu1YPwD1ARfIUPdkbU1AmMwaeIYEdADEWQQjMFoeqmQ/kj2XiZUTSmfd8HZ3ccl3j3gecgnVoyPViNsbvvqFTx7oG5OOQ7/AGih8kWqssLJ8UI+5kWkt4UbmYuatw5D6lhNdFxlcDcP++YreHaIEBNcJnqdogIRmNuoXUFMvkZfd7TssTcqbskEcxAYt6Hr5g8FabR98eygaAZC8vDEJpnzX6M/OKRbKG4PG8/LhyfFNPyLykdbi+OseKFaibBJzUcUeIE/eqdPcVKiyIxQyTBrv6z72eISNlevp5k6T5x0svHmTly2bKFUKTpOrEOz0fRQ2i4F9WvEXWU6VOcXS0i2WpThtNDtkpr2Yr0NDbxwpcPpLChprJ3vt9+Jr8hHVs7/R/d2Zi5ni6090AP6MtNm4vmo+UvncrdTa8qvlqnqD3TRqbzz+ou6G5WST+LcIcFG5m4kFlUBmVpp5cZu7Sm2vgrS3UVsSXb+pA9ZQ/7EcnJTdxLDXCi7nMdrN3PzuHK1z5gBg2CX7CGeLl+sxJQPMWlXskR3a6iURVZj8WqLbKlWm3LpWTC0RGe6W+mHy5ykyevbRGfUmhEY9589QFCCKSOQ4ap8q4lSD8Do6qGQIPYmL0CZWK30czW3A6a469EpLkb35SPkM/lx2LuG4tnQT6LZEfGvoAdqUoWIUhQZmLKKtAtEKUwQBeO/v/dAie7s3biu3aDfAzEmlAVlU+cVjD5c/fgJw7BqSua1Zah1B0TAmP8sI8ZwmdBOx6aEJEzxFWkpZBSMY5hT9GtCRFAExow06NfWalXUCa/4+/VAmx5ADxRvhuCoqwoDfqBI8kAQhmNJ+It+u3WwsK6/lYiBHsjfr41ESVaUUb8vKmK/u9jVn78IdngRYhDnFIyB5p6GslvpulssCdPnc9VMVC1RwedAH8l4V35FvbgOqcq3W8+aHx/pfMQnklLnTFumQhOr1c2UTn4+2ouv/wICxuBkn87QXimTqM+h9bCiDAuOzlaysyb8NspkYZ9d9InJOcXGI1BOrIqMHBmxwvAf/emLNkN7P+asU+TYgwksBp5x0dTXrluErjhEvzcjSAs5U7x6j9SgJDhl2XD30IJiI2xdJhnTOuEO2XSPrXSaCMfqZTLvC4YvLE4MHVbD6bW8RxG72zfUqhLy6F3UmZ/8zOzbzuQ/3yr8lqbOqu4zxuht9UtYoK9Y9068Sxj/7P2G8fMx+a+F9GW9HO4ddbnIA7wpQnFzXZpuDI+ndXaISHmzF5q746V4xoHn83sP1DlkcUUKMAawjEiFI9ADpGq6yJplXP2hmaZSU1OTaTd5DilTP9fAxwWiDBY1GPflUV8YyOJo+PwHtN8mNjwHAAA=',
    newsletterJid: '120363425498536494@newsletter', // Newsletter JID for menu forwarding
    updateZipUrl: 'https://github.com/hamidanoo/Nova-2.0/archive/refs/heads/main.zip', // URL to latest code zip for .update command
    
    // Sticker Configuration
    packname: 'Nova 2.0',
    
    // Bot Behavior
    selfMode: false, // Private mode only owner can use commands
    autoRead: false,
    autoTyping: false,
    autoBio: false,
    autoSticker: false,
    autoReact: false,
    autoReactMode: false, // set bot or all via cmd
    autoDownload: false,
    
    // Group Settings Defaults
    defaultGroupSettings: {
      antilink: false,
      antilinkAction: false, // 'delete', 'kick', 'warn'
      antitag: false,
      antitagAction: false,
      antiall: false, // Owner only - blocks all messages from non-admins
      antiviewonce: false,
      antibot: false,
      anticall: false, // Anti-call feature
      antigroupmention: false, // Anti-group mention feature
      antigroupmentionAction: false, // 'delete', 'kick'
      welcome: false,
      welcomeMessage: '╭╼━≪•𝙽𝙴𝚆 𝙼𝙴𝙼𝙱𝙴𝚁•≫━╾╮\n┃𝚆𝙴𝙻𝙲𝙾𝙼𝙴: @user 👋\n┃Member count: #memberCount\n┃𝚃𝙸𝙼𝙴: time⏰\n╰━━━━━━━━━━━━━━━╯\n\n*@user* Welcome to *@group*! 🎉\n*Group 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽*\ngroupDesc\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ botName*',
      goodbye: false,
      goodbyeMessage: 'Goodbye @user 👋 We will never miss you!',
      antiSpam: false,
      antidelete: false,
      nsfw: false,
      detect: false,
      chatbot: false,
      autosticker: false // Auto-convert images/videos to stickers
    },
    
    // API Keys (add your own)
    apiKeys: {
      // Add API keys here if needed
      openai: '',
      deepai: '',
      remove_bg: ''
    },
    
    // Message Configuration
    messages: {
      wait: '⏳ Please wait...',
      success: '✅ Success!',
      error: '❌ Error occurred!',
      ownerOnly: '👑 This command is only for bot owner!',
      adminOnly: '🛡️ This command is only for group admins!',
      groupOnly: '👥 This command can only be used in groups!',
      privateOnly: '💬 This command can only be used in private chat!',
      botAdminNeeded: '🤖 Bot needs to be admin to execute this command!',
      invalidCommand: '❓ Invalid command!'
    },
    
    // Timezone
    timezone: 'Asia/Karachi',
    
    // Limits
    maxWarnings: 3,
    
    // Social Links (optional)
    social: {
      github: 'https://github.com/hamidanoo',
      instagram: 'https://instagram.com/hamidanoo56',
      youtube: 'https://www.facebook.com/hamidanoo56'
    }
};
  
