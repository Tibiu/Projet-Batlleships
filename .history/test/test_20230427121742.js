const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Battleship", function () {
  it("Should allow a player to join the game", async function () {
    const MyContract = await ethers.getContractFactory("Battleship");
    const myContract = await MyContract.deploy();

    await myContract.joinGame();
    const playerAddresses = await myContract.getPlayerAddresses();

    expect(playerAddresses).to.eql([await ethers.getSigner(0).getAddress()]);
  });

  it("Should not allow a player to join the game if it is full", async function () {
    const MyContract = await ethers.getContractFactory("MyContract");
    const myContract = await MyContract.deploy();

    await myContract.joinGame();
    await myContract.joinGame();

    const playerAddresses = await myContract.getPlayerAddresses();
    expect(playerAddresses.length).to.equal(2);

    await expect(myContract.joinGame()).to.be.revertedWith("Game is full");
  });

  it("Should not allow a player to join the game twice", async function () {
    const MyContract = await ethers.getContractFactory("MyContract");
    const myContract = await MyContract.deploy();

    await myContract.joinGame();

    const playerAddresses = await myContract.getPlayerAddresses();
    expect(playerAddresses.length).to.equal(1);

    await expect(myContract.joinGame()).to.be.revertedWith("Player already joined the game");
  });
});
