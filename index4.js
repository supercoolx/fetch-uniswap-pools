const fs = require('fs');
const Web3 = require('web3');
const pools = require('./output3.json');
const abi = require('./abi/router.json');
const multicallABI = require('./abi/multicall.json');

const web3 = new Web3('https://bsc-dataseed.binance.org/');
const router = new web3.eth.Contract(abi, '0x10ED43C718714eb63d5aA57B78B54704E256024E');
const multicall = new web3.eth.Contract(multicallABI, '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B');

const main = async () => {
    let i = 0, step = 100;
    const length = pools.length;
    const output = [];
    const weth = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
    for (; i < length; i += step) {
        console.log(i);
        let indexes = [];
        for (j = 0; j < step; j++) indexes.push(i + j);

        let calls = [];
        indexes.forEach(index => {
            if (!pools[index]) return;
            calls.push([
                '0x10ED43C718714eb63d5aA57B78B54704E256024E',
                router.methods.getAmountsOut('1000000000000000000', [weth, pools[index][0], pools[index][1], weth]).encodeABI()
            ]);
        });
        
        try {
            let result = await multicall.methods.tryAggregate(false, calls).call();
            for (j = 0; j < step; j++) {
                if (!result[j].success) continue;
                output.push([pools[i + j][0], pools[i + j][1]]);
            }
        }
        catch (err) { console.log(err.message); }
        fs.writeFileSync('output4.json', JSON.stringify(output, null, '\t'));
    }
}

main();