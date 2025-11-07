const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const os = require("os");
const path = require('path');
const axios = require('axios');
const fs = require('fs');

cmd({
    pattern: "env",
    desc: "menu the bot",
    category: "env",
    react: "💋",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        const dec = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🔰 *${config.BOT_NAME} CONTROL PANEL* 🔰
┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 👑 *Owner:* ${config.OWNER_NAME}
┃ ⚙️ *Mode:* ${config.MODE}
┃ 💻 *Platform:* Heroku
┃ 🧠 *Type:* NodeJs (Multi Device)
┃ ⌨️ *Prefix:* ${config.PREFIX}
┃ 🧾 *Version:* 3.0.0 Beta
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━〔 ⚡ *Command Menu* ⚡ 〕━━━┓
┃ ▶️ *admin-events*
┃ ▶️ *welcome*
┃ ▶️ *setprefix*
┃ ▶️ *mode*
┃ ▶️ *auto_typing*
┃ ▶️ *always_online*
┃ ▶️ *auto_reacording*
┃ ▶️ *status_view*
┃ ▶️ *status_react*
┃ ▶️ *read_message*
┃ ▶️ *auto_sticker*
┃ ▶️ *anti_bad*
┃ ▶️ *auto_reply*
┃ ▶️ *auto_voice*
┃ ▶️ *custom_reacts*
┃ ▶️ *auto_react*
┃ ▶️ *anti_link*
┃ ▶️ *status_reply*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

💬 *${config.DESCRIPTION}*
`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363416743041101@newsletter',
                        newsletterName: '𝐸𝑅𝐹𝒜𝒩 𝒜𝐻𝑀𝒜𝒟',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error(e);
        reply(`❌ Error:\n${e}`);
    }
});
