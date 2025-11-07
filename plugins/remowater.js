const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "dewatermark",
  alias: ["watermark", "rmwatermark", "cleanimage"],
  desc: "Remove watermark from an image using AI",
  category: "image-tools",
  use: ".dewatermark <image_url>",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  const imageUrl = args.join(" ");
  if (!imageUrl) {
    return reply("💧 Please provide an image URL to remove watermark.\n\nExample:\n*.dewatermark https://example.com/photo.jpg*");
  }

  try {
    const apiUrl = `https://api.mrfrankofc.gleeze.com/api/tools/dewatermark?url=${encodeURIComponent(imageUrl)}`;
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    const buffer = Buffer.from(response.data, 'binary');

    await conn.sendMessage(mek.chat, {
      image: buffer,
      caption: `🧼 *Watermark Removed Successfully!*\n\n> Processed by *ERFAN AI Cleaner*`
    }, { quoted: mek });

  } catch (error) {
    console.error("❌ Error removing watermark:", error.message);
    reply("❌ *Failed to connect to API or unsupported image format.* Please try again with a valid image URL.");
  }
});
