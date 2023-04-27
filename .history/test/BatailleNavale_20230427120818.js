const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatailleNavale", function() {

  it("devrait placer un bateau", async function() {
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    const bn = await BatailleNavale.deploy();
    await bn.deployed();

    await bn.placerBateau(0, 0);
    const bateau = await bn.grille(0, 0);
    expect(bateau.coule).to.equal(false);
  });

  it("devrait couler un bateau", async function() {
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    const bn = await BatailleNavale.deploy();
    await bn.deployed();

    await bn.placerBateau(0, 0);
    await bn.attaquer(0, 0);
    const coule = await bn.estCoule(0, 0);
    expect(coule).to.equal(true);
  });

});
