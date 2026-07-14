const fs = require("fs");

let blacklist = [];

if (fs.existsSync("lynblacklisted.json")) {
    try {
        blacklist = JSON.parse(
            fs.readFileSync("lynblacklisted.json", "utf8")
        );
    } catch {
        blacklist = [];
    }
}

function saveBlacklist() {
    fs.writeFileSync(
        "lynblacklisted.json",
        JSON.stringify(blacklist, null, 2)
    );
}

module.exports = {
    blacklist,
    saveBlacklist
};