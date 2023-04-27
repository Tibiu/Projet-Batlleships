const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatailleNavale", function() {
  let bn;

  beforeEach(async () => {
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    const [player1, player2] = await ethers.getSigners();
    bn = await BatailleNavale.deploy(player2.address);
    await bn.connect(player1).placerBateau(0, 0);
  });

  it("should place a boat on the player1 grid", async function() {
    expect(await bn.grilles(await ethers.provider.getSigner(0)).x).to.equal(0);
    expect(await bn.grilles(await ethers.provider.getSigner(0)).y).to.equal(0);
  });

  it("should not place a boat on a position that already has a boat", async function() {
    await expect(bn.connect(await ethers.getSigner(1)).placerBateau(0, 0)).to.be.revertedWith("Ce bateau est déjà placé");
  });

  it("should attack a boat", async function() {
    await bn.connect(await ethers.getSigner(1)).attaquer(0, 0);
    expect(await bn.grilles(await ethers.provider.getSigner(0)).coule).to.equal(true);
  });

  it("should not attack a position that has already been attacked", async function() {
    await bn.connect(await ethers.getSigner(1)).attaquer(0, 0);
    await expect(bn.connect(await ethers.getSigner(1)).attaquer(0, 0)).to.be.revertedWith("Ce bateau est déjà coulé");
  });

  it("should emit an event when attacking a boat", async function() {
    await expect(bn.connect(await ethers.getSigner(1)).attaquer(0, 0)).to.emit(bn, "Attaque").withArgs(await ethers.getSigner(1).getAddress(), 0, 0, true);
  });

  it("should end the game when all boats of one player have been sunk", async function() {
    await bn.connect(await ethers.getSigner(1)).attaquer(0, 0);
    expect(await bn.partieFini()).to.equal(true);
  });
});
