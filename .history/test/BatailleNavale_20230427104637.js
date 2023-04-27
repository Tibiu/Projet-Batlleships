const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatailleNavale", function () {
  let BatailleNavale;
  let bn;
  let joueur1;
  let joueur2;

  beforeEach(async function () {
    BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    [joueur1, joueur2] = await ethers.getSigners();
    bn = await BatailleNavale.connect(joueur1).deploy(joueur2.address);
    await bn.deployed();
  });

  describe("placerBateau", function () {
    it("placer un bateau sur la grille", async function () {
      await bn.connect(joueur1).placerBateau(1, 1);
      const bateau = await bn.grilles(joueur1.address, 1, 1);
      expect(bateau.place).to.equal(true);
    });

    it("devrait renvoyer une erreur si le bateau est déjà placé", async function () {
      await bn.connect(joueur1).placerBateau(1, 1);
      await expect(bn.connect(joueur1).placerBateau(1, 1)).to.be.revertedWith(
        "Ce bateau est déjà placé"
      );
    });
  });

  
});