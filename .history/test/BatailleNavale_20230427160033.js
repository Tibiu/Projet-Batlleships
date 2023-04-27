// SPDX-License-Identifier: MIT

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatailleNavale", function () {
  let bn;
  let joueur1;
  let joueur2;

  beforeEach(async function () {
    [joueur1, joueur2] = await ethers.getSigners();
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    bn = await BatailleNavale.deploy(joueur1.address, joueur2.address);
    await bn.deployed();
  });

  it("Permet aux joueurs placer des bateaux", async function () {
    await bn.connect(joueur1).placerBateau(0, 0);
    await bn.connect(joueur2).placerBateau(1, 1);
    const bateauJoueur1 = await bn.grille(0, 0);
    const bateauJoueur2 = await bn.grille(1, 1);
    expect(bateauJoueur1.x).to.equal(0);
    expect(bateauJoueur1.y).to.equal(0);
    expect(bateauJoueur1.coule).to.equal(false);
    expect(bateauJoueur2.x).to.equal(1);
    expect(bateauJoueur2.y).to.equal(1);
    expect(bateauJoueur2.coule).to.equal(false);
  });

  it("Permet aux joueurs d'attaquer des bateaux", async function () {
    await bn.connect(joueur1).placerBateau(0, 0);
    await bn.connect(joueur2).attaquer(0, 0);
    const bateauJoueur1 = await bn.grille(0, 0);
    const bateauJoueur2 = await bn.grille(0, 0);
    expect(bateauJoueur1.coule).to.equal(false);
    expect(bateauJoueur2.coule).to.equal(true);
  });

  it("Retourne true si tous les bateaux sont coulés", async function () {
    await bn.connect(joueur1).placerBateau(0, 0);
    await bn.connect(joueur2).placerBateau(1, 1);
    await bn.connect(joueur2).attaquer(0, 0);
    await bn.connect(joueur1).attaquer(1, 1);
    const partieTerminee = await bn.partieTerminee();
    expect(partieTerminee).to.equal(true);
  });

  it("Retourne l'adresse du gagnant", async function () {
    await bn.connect(joueur1).placerBateau(0, 0);
    await bn.connect(joueur2).placerBateau(1, 1);
    await bn.connect(joueur2).attaquer(0, 0);
    await bn.connect(joueur1).attaquer(1, 1);
    const vainqueur = await bn.vainqueur();
    expect(vainqueur).to.equal(joueur2.address);
  });
});
