const fs = require("fs");

let input = fs.readFileSync(0, "utf8").trim().split(/\s+/);

let index = 0;
function readInt() {
    return Number(input[index++]);
}
let t = readInt();
let answer = [];

while(t--){
    let n = readInt();
    let a = [];

    for(let i=0;i<n;i++){
        a.push(readInt());
    }
    let map = new Map();
    let ans = 0;
    for(let x = 0; x <= n-5; x++){
        let val = a[x] + a[x+2] - a[x+4];
        if(map.has(val)){
            ans += map.get(val);
        }

        if(x >= 2){
            let prev = a[x-2] + a[x] - a[x+2];
            if(prev === val){
                ans--;
            }
        }
        if(x >= 4){
            let prev = a[x-4] + a[x-2] - a[x];
            if(prev === val){
                ans--;
            }
        }
        if(map.has(val)){
            map.set(val, map.get(val)+1);
        }else{
            map.set(val, 1);
        }
    }
    answer.push(ans.toString());
}
console.log(answer.join("\n"));