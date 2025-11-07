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
┏━━━━━━━━━━━━━━━━━━━━┓
┃ 🔰 *${config.BOT_NAME} CONTROL PANEL* 🔰
┃━━━━━━━━━━━━━━━━━━━━
┃ 👑 *Owner:* ${config.OWNER_NAME}
┃ ⚙️ *Mode:* ${config.MODE}
┃ 💻 *Platform:* Heroku
┃ 🧠 *Type:* NodeJs (Multi Device)
┃ ⌨️ *Prefix:* ${config.PREFIX}
┃ 🧾 *Version:* 3.0.0 Beta
┗━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ *⚡ CONTROL COMMAND*
┃━━━━━━━━━━━━━━━━━━━━━━━
┃ 🧠 *Total Commands:* 27
┃━━━━━━━━━━━━━━━━━━━

┃ 💎 *setbotimage*
┃ ⚙️ *setprefix*
┃ 🪄 *setbotname*
┃ 👑 *setownername*
┃ 🎉 *welcome*
┃ 👋 *goodbye*
┃ 🛰️ *mode*
┃ 🚫 *anti-call*
┃ ⌨️ *autotyping*
┃ 🌐 *alwaysonline*
┃ 🎧 *autorecoding*
┃ 💬 *autostatusreact*
┃ 👀 *autostatusview*
┃ 📖 *autoread*
┃ 🚷 *antibad*
┃ 🧩 *autosticker*
┃ 🤖 *autoreply*
┃ 💫 *autoreact*
┃ 🕊️ *autostatusreply*
┃ 🛡️ *antibot*
┃ 🔗 *antilink*
┃ 💬 *mention-reply*
┃ 🧭 *admin-events*
┃ 💥 *ownerreact*
┃ ❌ *deletelink*
┃ 🎭 *customreact*
┃ 🔧 *setreacts*
┗━━━━━━━━━━━━━━━━━━┛

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
