const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatailleNavale", function () {
  let batailleNavale;
  let joueur1;
  let joueur2;

  beforeEach(async function () {
    [joueur1, joueur2] = await ethers.getSigners();
    batailleNavale = await ethers.getContractFactory("BatailleNavale");
    batailleNavale = await batailleNavale.deploy(joueur1.address, joueur2.address);
  });

  it("should allow players to place boats", async function () {
    await batailleNavale.connect(joueur1).placerBateau(0, 0);
    await batailleNavale.connect(joueur2).placerBateau(1, 1);
    const bateau1 = await batailleNavale.grilles(joueur1.address, 0, 0);
    const bateau2 = await batailleNavale.grilles(joueur2.address, 1, 1);
    expect(bateau1.x).to.equal(0);
    expect(bateau1.y).to.equal(0);
    expect(bateau1.coule).to.equal(false);
    expect(bateau2.x).to.equal(1);
    expect(bateau2.y).to.equal(1);
    expect(bateau2.coule).to.equal(false);
  });

  it("should not allow players to place boats on already occupied spots", async function () {
    await batailleNavale.connect(joueur1).placerBateau(0, 0);
    await expect(batailleNavale.connect(joueur2).placerBateau(0, 0)).to.be.revertedWith("Cette case est déjà occupée.");
  });

  it("should not allow players to attack twice on the same spot", async function () {
    await batailleNavale.connect(joueur1).placerBateau(0, 0);
    await batailleNavale.connect(joueur2).attaquer(0, 0);
    await expect(batailleNavale.connect(joueur2).attaquer(0, 0)).to.be.revertedWith("Cette case a déjà été attaquée.");
  });

  it("should end the game when one player's boats are all sunk", async function () {
    await batailleNavale.connect(joueur1).placerBateau(0, 0);
    await batailleNavale.connect(joueur2).placerBateau(1, 1);
    await batailleNavale.connect(joueur1).attaquer(0, 0);
    await batailleNavale.connect(joueur2).attaquer(1, 1);
    const estTerminee = await batailleNavale.estPartieTerminee(joueur1.address);
    expect(estTerminee).to.equal(true);
  });

  it("should switch turns after each attack", async function () {
    await batailleNavale.connect(joueur1).placerBateau(0, 0);
    await batailleNavale.connect(joueur2).placerBateau(1, 1);
    await batailleNavale.connect(joueur1).attaquer(0, 0);
    const joueurCourant = await batailleNavale.joueurCourant();
    expect(joueurCourant).to.equal(joueur2.address);
  });
});
