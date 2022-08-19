const fs = require('fs');
const Web3 = require('web3');
const poolABI = require('./abi/pool.json');
const multicallABI = require('./abi/multicall.json');

const web3 = new Web3('https://mainnet.infura.io/v3/619d04c873ab43a7adc83307184991b0');

const pool = new web3.eth.Contract(poolABI, '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f');
const multicall = new web3.eth.Contract(multicallABI, '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696');

const rows = fs.readFileSync('output1.txt').toString('utf-8').split('\n');
let encoded0 = pool.methods.token0().encodeABI();
let encoded1 = pool.methods.token1().encodeABI();

fs.writeFileSync('output2.txt', '');

const main = async () => {
    let length = rows.length;
    let step = 50;
    for (let i = 0; i < length; i += step) {
        console.log(i);

        let indexes = [];
        for (let j = 0; j < step; j++) indexes.push(i + j);

        let calls = [];
        indexes.forEach(index => calls.push([rows[index], encoded0], [rows[index], encoded1]));

        let result = await multicall.methods.tryAggregate(false, calls).call();
        let tokens = result.map(res => {
            if (!res.success) return null;
            return web3.eth.abi.decodeParameter('address', res.returnData);
        });

        let output = '';
        for (let j = 0; j < step * 2; j += 2) {
            output += tokens[j] + ' ' + tokens[j + 1] + '\n';
        }

        fs.appendFileSync('output2.txt', output);
    }
}

main();