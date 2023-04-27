const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Battleship", function () {
  it("Should allow a player to join the game", async function () {
    const MyContract = await ethers.getContractFactory("MyContract");
    const myContract = await MyContract.deploy();

    await myContract.joinGame();
    const playerAddresses = await myContract.getPlayerAddresses();

    expect(playerAddresses).to.eql([await ethers.getSigner(0).getAddress()]);
  });
});