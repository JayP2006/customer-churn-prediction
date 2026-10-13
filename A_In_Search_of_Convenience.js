const fs = require("fs");

let input = fs.readFileSync(0, "utf8").trim().split(/\s+/);

let index = 0;

function readInt() {
    return Number(input[index++]);
}
let t = readInt();

let ans = [];

while(t--) {
    let x0 = readInt();
    let y0= readInt();
    let r = readInt();


    let x = x0 + r;
    let y = y0;

    ans.push(x +" "+y);
}
console.log(ans.join("\n"));
