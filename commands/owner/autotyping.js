const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../../data/autotyping.json');

function load() {
  if (!fs.existsSync(CONFIG_PATH)) return { enabled: false };
  return JSON.parse(fs.readFileSync(CONFIG_PATH));
}

function save(data) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  name: 'autotyping',
  aliases: ['typing'],
  category: 'owner', 
  ownerOnly: true,

  async execute(sock, msg, args, extra) {
    const input = args[0];
    let config = load();

    if (!input) {
      return extra.reply(`AutoTyping: ${config.enabled ? 'ON' : 'OFF'}`);
    }

    if (input === 'on') config.enabled = true;
    else if (input === 'off') config.enabled = false;
    else return extra.reply('Use: .autotyping on/off');

    save(config);
    return extra.reply(`AutoTyping ${config.enabled ? 'Enabled' : 'Disabled'}`);
  }
};