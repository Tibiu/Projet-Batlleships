const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatailleNavale", function () {

  let player1, player2;
  let batailleNavale;

  beforeEach(async () => {
    [player1, player2] = await ethers.getSigners();
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    batailleNavale = await BatailleNavale.deploy();
    await batailleNavale.deployed();
  });

  it("should place a boat on the grid", async function () {
    await batailleNavale.placerBateau(1, 2);
    const boat = await batailleNavale.grille(1, 2);
    expect(boat.coule).to.equal(false);
  });

  it("should attack a boat and sink it", async function () {
    await batailleNavale.placerBateau(1, 2);
    await batailleNavale.attaquer(1, 2);
    const boat = await batailleNavale.grille(1, 2);
    expect(boat.coule).to.equal(true);
  });

  it("should return true when a boat is sunk", async function () {
    await batailleNavale.placerBateau(1, 2);
    await batailleNavale.attaquer(1, 2);
    const isSunk = await batailleNavale.coule(1, 2);
    expect(isSunk).to.equal(true);
  });

  it("should return false when a boat is not sunk", async function () {
    await batailleNavale.placerBateau(1, 2);
    const isSunk = await batailleNavale.coule(1, 2);
    expect(isSunk).to.equal(false);
  });

});
