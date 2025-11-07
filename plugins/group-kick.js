const { cmd } = require('../command');

cmd({
    pattern: "kick",
    alias: ["remove", "k"],
    desc: "Remove a group member (admins only)",
    category: "admin",
    react: "🗑️",
    filename: __filename
},
async (Void, citel, text) => {
    try {
        if (!citel.isGroup) return citel.reply("❌ This command works only in groups!");

        const groupMetadata = await Void.groupMetadata(citel.chat);
        const participants = groupMetadata.participants;

        const botNumber = Void.user.id.split(":")[0] + "@s.whatsapp.net";
        const sender = citel.sender;

        const bot = participants.find(p => p.id === botNumber);
        const user = participants.find(p => p.id === sender);

        // Bot must be admin
        if (!bot?.admin) {
            return citel.reply("❌ I must be admin to use this command!");
        }

        // Only admins can use this command
        if (!user?.admin) {
            return citel.reply("❌ Only *group admins* can use this command!");
        }

        // Get target user (mentioned or quoted)
        const target = citel.quoted?.sender || citel.mentionedJid?.[0];
        if (!target) return citel.reply("❌ Mention or reply to the user you want to kick!");

        // Prevent kicking itself
        if (target === botNumber) {
            return citel.reply("❌ I can’t kick myself!");
        }

        // Prevent kicking the group owner
        const owner = groupMetadata.owner || groupMetadata.participants.find(p => p.admin === 'superadmin')?.id;
        if (target === owner) {
            return citel.reply("❌ I can’t kick the group owner!");
        }

        // Kick target
        await Void.groupParticipantsUpdate(citel.chat, [target], "remove");

        // Success message
        await citel.reply(`🚫 @${target.split('@')[0]} has been kicked by admin @${sender.split('@')[0]}`, {
            mentions: [target, sender]
        });

    } catch (error) {
        console.error("[KICK ERROR]", error);
        citel.reply("❌ Failed to kick. Maybe I lost admin rights or target is a super-admin?");
    }
});
