const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "video",
    alias: ["ytvideo", "ytmp4", "ytv"],
    desc: "Download YouTube video using JawadTech API",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply("🎥 Please provide a YouTube video name or URL!\n\nExample: `.video pal pal`");

        let url = q;
        let videoInfo = null;

        // Detect if it's a URL or a title
        if (q.startsWith('http://') || q.startsWith('https://')) {
            if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
                return await reply("❌ Please provide a valid YouTube URL!");
            }
            const videoId = getVideoId(q);
            if (!videoId) return await reply("❌ Invalid YouTube URL!");
            const searchFromUrl = await yts({ videoId: videoId });
            videoInfo = searchFromUrl;
        } else {
            const search = await yts(q);
            if (!search.videos || search.videos.length === 0) {
                return await reply("❌ No results found!");
            }
            videoInfo = search.videos[0];
            url = videoInfo.url;
        }

        // Extract video ID
        function getVideoId(url) {
            const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            return match ? match[1] : null;
        }

        // Send thumbnail + details before downloading
        await conn.sendMessage(from, {
            image: { url: videoInfo.thumbnail },
            caption: `🎬 *${videoInfo.title}*\n⏰ *Duration:* ${videoInfo.timestamp}\n👁️ *Views:* ${videoInfo.views}\n\n⏳ *Downloading, please wait...*`
        }, { quoted: mek });

        // Call JawadTech API
        const api = `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(url)}`;
        const res = await axios.get(api);
        const data = res.data;

        // Check API response
        if (!data?.status || !data?.result?.mp4) {
            return await reply("❌ Failed to fetch download link from API!");
        }

        const { title, mp4 } = data.result;

        // Send the video
        await conn.sendMessage(from, {
            video: { url: mp4 },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: `🎬 *${title}*\n> ✅ Download completed successfully!\n\n> *DARKZONE-MD*`
        }, { quoted: mek });

        // Success reaction
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error("❌ Error in .video command:", err);
        await reply("⚠️ Something went wrong while downloading the video!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
