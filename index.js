const fs = require('fs');
const Web3 = require('web3');
const poolABI = require('./abi/pool.json');
const factoryABI = require('./abi/factory.json');
const multicallABI = require('./abi/multicall.json');

const web3 = new Web3('https://mainnet.infura.io/v3/619d04c873ab43a7adc83307184991b0');

const pool = new web3.eth.Contract(poolABI, '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f');
const factory = new web3.eth.Contract(factoryABI, '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f');
const multicall = new web3.eth.Contract(multicallABI, '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696');

const getTokens = async (pair) => {
    let calls = [
        [pair, pool.methods.token0().encodeABI()],
        [pair, pool.methods.token1().encodeABI()]
    ];
    let result = await multicall.methods.aggregate(calls).call();
    let token0 = web3.eth.abi.decodeParameter('address', result.returnData[0]);
    let token1 = web3.eth.abi.decodeParameter('address', result.returnData[1]);
    fs.appendFileSync("pairs.txt", token0 + " " + token1 + "\n");
}

const main = async () => {
    let i = 0;
    for (; i < 90000; i++) {
        console.log(i);
        try {
            let pair = await factory.methods.allPairs(i).call();
            await getTokens(pair);
        } catch (err) { }
    }
}

main();