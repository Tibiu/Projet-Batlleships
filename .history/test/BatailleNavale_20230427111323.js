const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatailleNavale", function() {
  let bn;

  beforeEach(async function () {
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    bn = await BatailleNavale.deploy("0x0000000000000000000000000000000000000000");
    await bn.deployed();
  });

  it("devrait interdire de placer deux bateaux sur la même case", async function() {
    await bn.placerBateau(1, 2);
    await expect(bn.placerBateau(1, 2)).to.be.revertedWith("Un bateau est déjà placé sur cette case");
  });

  it("devrait permettre à un joueur de couler un bateau de l'autre joueur", async function() {
    const joueur1 = await ethers.provider.getSigner(0);
    const joueur2 = await ethers.provider.getSigner(1);
    await bn.connect(joueur1).placerBateau(1, 1);
    await bn.connect(joueur2).attaquer(1, 1);
    expect(await bn.estCoule(1, 1)).to.be.true;
  });

  it("devrait empêcher un joueur de couler son propre bateau", async function() {
    const joueur1 = await ethers.provider.getSigner(0);
    await bn.connect(joueur1).placerBateau(1, 1);
    await expect(bn.connect(joueur1).attaquer(1, 1)).to.be.revertedWith("Ce bateau est déjà coulé");
  });

  it("devrait déclarer le joueur 1 comme gagnant si tous les bateaux du joueur 2 sont coulés", async function() {
    const joueur1 = await ethers.provider.getSigner(0);
    const joueur2 = await ethers.provider.getSigner(1);
    await bn.connect(joueur1).placerBateau(1, 1);
    await bn.connect(joueur1).placerBateau(2, 2);
    await bn.connect(joueur1).placerBateau(3, 3);
    await bn.connect(joueur2).attaquer(1, 1);
    await bn.connect(joueur2).attaquer(2, 2);
    await bn.connect(joueur2).attaquer(3, 3);
    expect(await bn.partieTerminee()).to.be.true;
    expect(await bn.connect(joueur1).partieTerminee()).to.be.true;
    expect(await bn.connect(joueur2).partieTerminee()).to.be.true;
    expect(await bn.estCoule(1, 1)).to.be.true;
    expect(await bn.estCoule(2, 2)).to.be.true;
    expect(await bn.estCoule(3, 3)).to.be.true;
    expect(await bn.partieTerminee()).to.be.true;
    expect(await bn.connect(joueur1).partieTerminee()).to.be.true;
    expect(await bn.connect(joueur2).partieTerminee()).to.be.true;
    expect(await bn.partieTerminee()).to.equal(joueur1.getAddress());
  });

});
