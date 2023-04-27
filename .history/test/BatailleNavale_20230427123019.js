const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatailleNavale", function () {
  let batailleNavale;

  beforeEach(async () => {
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    batailleNavale = await BatailleNavale.deploy();
    await batailleNavale.deployed();
  });

  it("should place a boat", async function () {
    await batailleNavale.placerBateau(3, 5);
    const boat = await batailleNavale.grille(3, 5);
    expect(boat.x).to.equal(3);
    expect(boat.y).to.equal(5);
    expect(boat.coule).to.equal(false);
  });

  it("should sink a boat", async function () {
    await batailleNavale.placerBateau(3, 5);
    await batailleNavale.attaquer(3, 5);
    const boat = await batailleNavale.grille(3, 5);
    expect(boat.coule).to.equal(true);
  });

  it("should check if a boat is sunk", async function () {
    await batailleNavale.placerBateau(3, 5);
    await batailleNavale.attaquer(3, 5);
    const isBoatSunk = await batailleNavale.estCoule(3, 5);
    expect(isBoatSunk).to.equal(true);
  });
});
