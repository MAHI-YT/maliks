const { cmd } = require('../command');

cmd({
    pattern: "add",
    alias: ["invite"],
    desc: "Add a member to the group using their number",
    category: "group",
    react: "➕",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isAdmins, isBotAdmins, reply }) => {

    // Must be in a group
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    // Only admins can use this command
    if (!isAdmins) return reply("❌ Only group admins can use this command.");

    // Bot must be admin
    if (!isBotAdmins) return reply("❌ I need to be an admin to add members.");

    // Check if a number is provided
    if (!q || !/^\d+$/.test(q)) {
        return reply("📱 Please provide a valid phone number.\nExample: `.add 923001234567`");
    }

    const userJid = `${q}@s.whatsapp.net`;

    try {
        // Try adding the number to the group
        await conn.groupParticipantsUpdate(from, [userJid], "add");

        // Success message
        await reply(`✅ Successfully added @${q}\n~ DARKZONE-MD`, { mentions: [userJid] });

    } catch (error) {
        console.error("Add Command Error:", error);

        // Handle known WhatsApp API errors
        if (error?.data?.error?.includes("not-authorized")) {
            reply("⚠️ This user has privacy settings that prevent being added to groups.");
        } else {
            reply("❌ Failed to add the member. Please try again later.");
        }
    }
});
