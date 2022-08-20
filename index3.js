const fs = require('fs');

const rows = fs.readFileSync('output2.txt').toString('utf-8').split('\n');

const main = () => {
    const weth = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    const output = [];
    rows.forEach(row => {
        let [token0, token1] = row.split(' ');
        if (token0 === weth || token1 === weth) return;
        output.push([token0, token1]);
    });
    fs.writeFileSync('output3.json', JSON.stringify(output, null, '\t'));
}

main();