const axios = require('axios');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "remini",
    alias: ["enhance"],
    react: "✨",
    desc: "Enhance image quality using AI",
    category: "image",
    use: ".remini <image_url> or reply to image",
    filename: __filename,
}, 
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        let imageUrl = q;

        // If no URL provided, check for quoted image
        if (!imageUrl && quoted?.imageMessage) {
            await reply("⏳ Downloading your image...");
            
            const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // Upload image to temporary URL
            const formData = new FormData();
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            formData.append('file', blob, 'image.jpg');

            const uploadResponse = await axios.post('https://tmpfiles.org/api/v1/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            imageUrl = uploadResponse.data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        }

        if (!imageUrl) {
            return reply("📸 *Remini AI Enhancement*\n\nSend: .remini <image_url>\nOr reply to image with: .remini\nExample: .remini https://example.com/image.jpg");
        }

        // Simple URL validation
        if (imageUrl && !imageUrl.startsWith('http')) {
            return reply("❌ Please provide a valid URL starting with http:// or https://");
        }

        await reply("⏳ Enhancing your image... Please wait!");

        const apiUrl = `https://api.princetechn.com/api/tools/remini?apikey=prince_tech_api_azfsbshfb&url=${encodeURIComponent(imageUrl)}`;
        
        const response = await axios.get(apiUrl, { timeout: 30000 });

        if (response.data?.success && response.data.result?.image_url) {
            const enhancedUrl = response.data.result.image_url;
            
            await conn.sendMessage(from, {
                image: { url: enhancedUrl },
                caption: "✨ *Image Enhanced Successfully!*\n\nEnhanced by DARKZONE-MD",
            }, { quoted: m });
            
        } else {
            throw new Error("API returned no image");
        }

    } catch (error) {
        console.error('Remini Error:', error.message);
        
        if (error.response?.status === 429) {
            reply("⏰ Too many requests. Try again later.");
        } else if (error.code === 'ECONNABORTED') {
            reply("⏰ Request timeout. Try again.");
        } else {
            reply("❌ Failed to enhance image. Check URL/image and try again.");
        }
    }
});