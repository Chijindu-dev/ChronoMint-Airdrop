// require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    tempo: {
      url: "https://rpc.testnet.tempo.xyz",
      accounts: ["0xaa0613a34d04f2ec93ed28997e3dc6d8ef88bc84c4d3a9e3e2e8beee3fd7f790"],
      chainId: 42429,
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
