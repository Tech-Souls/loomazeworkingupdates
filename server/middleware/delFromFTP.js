const ftp = require("basic-ftp");

async function delFromFTP(remotePath) {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        await client.access({
            host: process.env.ASURA_HOST,
            user: process.env.ASURA_USER,
            password: process.env.ASURA_PASS,
            port: Number(process.env.ASURA_PORT || 21),
            secure: false
        });

        const pathToDelete = remotePath.replace(/^https?:\/\/[^/]+\/?/, "");

        try {
            await client.remove(pathToDelete);
            return true;
        } catch (err) {
            console.log(`Could not delete ${pathToDelete}: ${err.message}`);
            return false;
        }
    } catch (error) {
        console.error("FTP connection error:", error);
        return false;
    } finally {
        client.close();
    }
}

module.exports = delFromFTP;