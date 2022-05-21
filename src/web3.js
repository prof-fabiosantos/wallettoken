import Web3 from "web3";
 
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/e8c1376f04e245fc8286ae1cd76c6977'));
 
export default web3;