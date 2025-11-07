const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demote group admin to normal member",
    category: "admin",
    react: "⬇️",
    filename: __filename
},
async(conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply
}) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // Check if the user is an admin
        if (!isAdmins) return reply("❌ Only group admins can use this command.");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

        let userToDemote = [];
        
        // Check for mentioned users
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            userToDemote = m.mentionedJid;
        }
        // Check for replied message
        else if (quoted && quoted.sender) {
            userToDemote = [quoted.sender];
        }
        // Check if user provided number in command
        else if (q && q.includes('@')) {
            userToDemote = [q.replace(/[@\s]/g, '') + '@s.whatsapp.net'];
        }
        
        // If no user found through any method
        if (userToDemote.length === 0) {
            return reply("❌ Please mention the user, reply to their message, or provide a number to demote!\nExample: .demote @user");
        }

        // Prevent demoting the bot itself
        const botJid = botNumber + '@s.whatsapp.net';
        if (userToDemote.includes(botJid)) {
            return reply("❌ I cannot demote myself!");
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Demote the user(s)
        await conn.groupParticipantsUpdate(from, userToDemote, "demote");
        
        // Get usernames for each demoted user
        const usernames = userToDemote.map(jid => `@${jid.split('@')[0]}`);

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        const demotionMessage = `*『 GROUP DEMOTION 』*\n\n` +
            `👤 *Demoted User${userToDemote.length > 1 ? 's' : ''}:*\n` +
            `${usernames.map(name => `• ${name}`).join('\n')}\n\n` +
            `👑 *Demoted By:* @${sender.split('@')[0]}\n\n` +
            `📅 *Date:* ${new Date().toLocaleString()}`;
        
        await reply(demotionMessage, { 
            mentions: [...userToDemote, sender]
        });

    } catch (error) {
        console.error("Demote command error:", error);
        
        if (error.message?.includes('429') || error.data === 429) {
            await reply("❌ Rate limit reached. Please try again in a few seconds.");
        } else if (error.message?.includes('not admin')) {
            await reply("❌ Failed to demote user(s). The user might not be an admin or I don't have sufficient permissions.");
        } else {
            await reply("❌ Failed to demote user(s). Please make sure the user is an admin and try again.");
        }
    }
});

// Function to handle automatic demotion detection (for participant updates)
async function handleDemotionEvent(conn, update) {
    try {
        const { id, participants, action } = update;
        
        // Check if this is a demotion action
        if (action === "demote" && participants && participants.length > 0) {
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get usernames for demoted participants
            const demotedUsernames = participants.map(jid => `@${jid.split('@')[0]}`);

            const demotionMessage = `*『 AUTO DEMOTION DETECTED 』*\n\n` +
                `👤 *Demoted User${participants.length > 1 ? 's' : ''}:*\n` +
                `${demotedUsernames.map(name => `• ${name}`).join('\n')}\n\n` +
                `📅 *Date:* ${new Date().toLocaleString()}`;
            
            await conn.sendMessage(id, {
                text: demotionMessage,
                mentions: participants
            });
        }
    } catch (error) {
        console.error("Error handling demotion event:", error);
    }
}

// Export the handler for main file
module.exports.handleDemotionEvent = handleDemotionEvent;