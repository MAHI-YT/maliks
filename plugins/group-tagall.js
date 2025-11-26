const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "tagall",
    react: "🔊",
    alias: ["gc_tagall"],
    desc: "To Tag all Members",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, sender, senderNumber, groupAdmins, prefix, command, args, body }) => {

    try {

        // --- GROUP ONLY CHECK ---
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // --- GENERATE CORRECT JIDs ---
        const botJid = conn.user.id.includes(":") ? conn.user.id.split(":")[0] + "@s.whatsapp.net" : conn.user.id;
        const senderJid = sender;

        // --- BOT OWNER CHECK ---
        const botOwner = config.OWNER_NUMBER ? config.OWNER_NUMBER.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : botJid;

        // --- ADMIN VALIDATION ---
        const isSenderAdmin = groupAdmins.includes(senderJid);
        const isBotAdmin = groupAdmins.includes(botJid);

        // Only group admins OR bot owner can use
        if (!isSenderAdmin && senderJid !== botOwner) {
            return reply("❌ Only group *admins* or the *bot owner* can use this command.");
        }

        // No "I need admin" issue — Only check if bot must send mentions
        if (!isBotAdmin) {
            return reply("❌ I need *admin permissions* to tag all members.");
        }

        // --- FETCH GROUP INFO ---
        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("❌ Failed to fetch group information.");

        const groupName = groupInfo.subject || "Group";
        const totalMembers = participants.length;

        if (totalMembers === 0) return reply("❌ No members found in this group.");

        // --- MESSAGE EXTRACTION ---
        let message = body.replace(prefix + command, "").trim();
        if (!message) message = "Attention Everyone";

        let emojis = ['📢','🔊','🌐','🔰','❤‍🩹','🤍','🖤','🩵','📝','💗','🔖','🪩','📦','🎉','🛡️','💸','⏳','🗿','🚀','🎧','🪀','⚡','🚩','🍁','🗣️','👻','⚠️','🔥'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        let teks = `▢ Group : *${groupName}*\n▢ Members : *${totalMembers}*\n▢ Message : *${message}*\n\n┌───⊷ *MENTIONS*\n`;

        for (let mem of participants) {
            teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
        }

        teks += "└──✪ DARKZONE ┃ MD ✪──";

        await conn.sendMessage(
            from,
            { text: teks, mentions: participants.map(m => m.id) },
            { quoted: mek }
        );

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ Error Occurred!\n\n${e.message}`);
    }

});
