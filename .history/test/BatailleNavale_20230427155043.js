const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatailleNavale", function() {
  let BatailleNavale;
  let bnInstance;
  let joueur1;
  let joueur2;

  beforeEach(async function() {
    [joueur1, joueur2] = await ethers.getSigners();
    BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    bnInstance = await BatailleNavale.connect(joueur1).deploy(joueur1.address, joueur2.address);
    await bnInstance.deployed();
  });

  it("Permet de placer un bateau", async function() {
    await bnInstance.connect(joueur1).placerBateau(1, 1);
    const bateau = await bnInstance.grille(1, 1);
    expect(bateau.x).to.equal(1);
    expect(bateau.y).to.equal(1);
    expect(bateau.coule).to.equal(false);
  });

  it("Permet de toucher un bateau", async function() {
    await bnInstance.connect(joueur1).placerBateau(1, 1);
    await bnInstance.connect(joueur2).attaquer(1, 1);
    const bateau = await bnInstance.grille(1, 1);
    expect(bateau.coule).to.equal(true);
  });

  describe("partieTerminee", function() {
    it("renvoie false lorsque la partie vient de commencer", async function() {
      expect(await bn.partieTerminee()).to.equal(false);
    });

    it("renvoie true lorsque tous les bateaux sont coulés", async function() {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          await bn.attaquer(i, j);
        }
      }
      expect(await bn.partieTerminee()).to.equal(true);
    });
  });

});