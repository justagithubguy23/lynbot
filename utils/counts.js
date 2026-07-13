const fs = require("fs");

const FILE = "./data/counts.json";

let counts = {};

function loadCounts() {
    if (fs.existsSync(FILE)) {
        try {
            counts = JSON.parse(fs.readFileSync(FILE, "utf8"));
        } catch {
            counts = {};
            saveCounts();
        }
    }

    return counts;
}

function saveCounts() {
    fs.writeFileSync(FILE, JSON.stringify(counts, null, 2));
}

module.exports = {
    counts,
    loadCounts,
    saveCounts
};