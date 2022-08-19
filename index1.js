const fs = require('fs');
const Web3 = require('web3');
const factoryABI = require('./abi/factory.json');
const multicallABI = require('./abi/multicall.json');

const web3 = new Web3('https://mainnet.infura.io/v3/619d04c873ab43a7adc83307184991b0');

const factory = new web3.eth.Contract(factoryABI, '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f');
const multicall = new web3.eth.Contract(multicallABI, '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696');

fs.writeFileSync('output1.txt', "");

const main = async () => {
    let i = 0;
    let step = 50;
    for (; i < 90000; i += step) {
        console.log(i);
        let indexes = [];
        for (let j = 0; j < step; j++) indexes.push(i + j);
        let calls = indexes.map(index => [
            '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
            factory.methods.allPairs(index).encodeABI()
        ]);
        try {
            let result = await multicall.methods.tryAggregate(false, calls).call();
            let pools = result.map(res => {
                if (!res.success) return null;
                return web3.eth.abi.decodeParameter('address', res.returnData);
            });
            let output = pools.join('\n') + '\n';
            fs.appendFileSync('output1.txt', output);
        } catch (err) { }
    }
}

main();