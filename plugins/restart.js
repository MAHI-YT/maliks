const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require("../data/updateDB");

cmd({
    pattern: "update",
    alias: ["upgrade", "sync"],
    react: "🆕",
    desc: "Update the bot to the latest version.",
    category: "misc",
    filename: __filename
}, async (client, message, args, { reply, isOwner }) => {
    if (!isOwner) return reply("🚫 Only the bot owner can run this command.");

    const repoOwner = "MAHI-YT";
    const repoName = "5993-95";
    const branch = "main";

    try {
        await reply("🔍 Checking for updates from GitHub...");

        // Fetch latest commit hash
        const { data: commitData } = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/commits/${branch}`);
        const latestCommitHash = commitData.sha;

        const currentHash = await getCommitHash();

        if (latestCommitHash === currentHash) {
            return reply("✅ Your bot is already up-to-date!");
        }

        await reply("🚀 Downloading the latest version...");

        // Download latest ZIP
        const zipUrl = `https://github.com/${repoOwner}/${repoName}/archive/refs/heads/${branch}.zip`;
        const zipPath = path.join(__dirname, "latest.zip");
        const { data: zipData } = await axios.get(zipUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(zipPath, zipData);

        // Extract ZIP
        await reply("📦 Extracting update files...");
        const extractPath = path.join(__dirname, "latest");
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        // Correct extracted folder name
        const extractedFolder = path.join(extractPath, `${repoName}-${branch}`);
        const destinationPath = path.join(__dirname, "..");

        await reply("🔄 Applying update...");
        copyFolderSync(extractedFolder, destinationPath);

        // Save latest commit hash
        await setCommitHash(latestCommitHash);

        // Cleanup
        fs.unlinkSync(zipPath);
        fs.rmSync(extractPath, { recursive: true, force: true });

        await reply("✅ Update complete! Restarting bot...");

        // Restart bot safely
        process.exit(0);
    } catch (err) {
        console.error("❌ Update failed:", err);
        reply("❌ Update failed. Check logs or try manually.");
    }
});

// Copy folder recursively while preserving important files
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });

    for (const item of fs.readdirSync(source)) {
        const src = path.join(source, item);
        const dest = path.join(target, item);

        // Skip these files
        if (["config.js", "app.json", "node_modules"].includes(item)) {
            console.log(`Skipping ${item} (preserved).`);
            continue;
        }

        if (fs.lstatSync(src).isDirectory()) {
            copyFolderSync(src, dest);
        } else {
            fs.copyFileSync(src, dest);
        }
    }
}
