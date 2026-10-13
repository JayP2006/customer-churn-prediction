const fs = require("fs");

let input = fs.readFileSync(0, "utf8").trim().split(/\s+/);

let index = 0;

function readInt() {
    return Number(input[index++]);
}
let t = readInt();
let ans = [];

while(t--){
    let n = readInt();
    let comm = input[index++];

    let stack = [];
    let printed = new Array(n+1).fill(false);
    
    for(let i=1;i<=n;i++){
        let command = comm[i-1];
        if(command === '1'){
            stack.push(i);
        }else if(command === '2'){
            if(stack.length > 0){

                let top = stack.pop();
                printed[top] = true;
            }else{
                printed[i] = true;
            }
    }else if(command === '3'){
        printed[i] = true;
    }
    }

let notprint = [];
for(let i=1;i<=n;i++){
    if(!printed[i]){
        notprint.push(i);
    }
}
ans.push(notprint.length.toString());
ans.push(notprint.join(" "));
}
console.log(ans.join("\n"));
