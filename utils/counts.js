const fs = require("fs");


let counts = {};


if (fs.existsSync("counts.json")) {

    counts = JSON.parse(
        fs.readFileSync("counts.json","utf8")
    );

}


function saveCounts(){

    fs.writeFileSync(
        "counts.json",
        JSON.stringify(counts,null,2)
    );

}


module.exports = {
    counts,
    saveCounts
};