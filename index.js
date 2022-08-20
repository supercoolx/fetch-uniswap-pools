const fs = require('fs');
const Web3 = require('web3');
const poolABI = require('./abi/pool.json');

const web3 = new Web3('https://mainnet.infura.io/v3/619d04c873ab43a7adc83307184991b0');

const rows = fs.readFileSync('output1.txt').toString('utf-8').split('\n');

const main = async () => {
    let i = 89900;
    for (; i < 90000; i++) {
        const pool = new web3.eth.Contract(poolABI, rows[i]);
        let token0 = await pool.methods.token0().call();
        let token1 = await pool.methods.token1().call();
        console.log(token0, token1);
    }
}

main();