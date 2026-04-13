const ftp = require("basic-ftp");
const path = require("path");

async function uploadToFTP(localPath) {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        await client.access({
            host: process.env.ASURA_HOST,
            user: process.env.ASURA_USER,
            password: process.env.ASURA_PASS,
            port: Number(process.env.ASURA_PORT || 22),
            secure: false
        });

        const filename = path.basename(localPath);
        const remotePath = `uploads/${filename}`;

        await client.uploadFrom(localPath, remotePath);

        return `${process.env.ASURA_SUBDOMAIN}/uploads/${filename}`;
    } finally {
        client.close();
    }
}

module.exports = uploadToFTP;