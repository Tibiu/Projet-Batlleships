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
    it("devrait placer un bateau sur la grille", async function () {
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

  describe("attaquer", function () {
    it("devrait renvoyer une erreur si le joueur n'est pas autorisé à attaquer", async function () {
      await expect(bn.connect(joueur1).attaquer(1, 1)).to.be.revertedWith(
        "Vous n'êtes pas autorisé à attaquer"
      );
    });

    it("devrait renvoyer une erreur si le bateau est déjà coulé", async function () {
      await bn.connect(joueur1).placerBateau(1, 1);
      await bn.connect(joueur2).attaquer(1, 1);
      await bn.connect(joueur2).attaquer(1, 1);
      await expect(bn.connect(joueur2).attaquer(1, 1)).to.be.revertedWith(
        "Ce bateau est déjà coulé"
      );
    });

    it("devrait couler un bateau si l'attaque est réussie", async function () {
      await bn.connect(joueur1).placerBateau(1, 1);
      await bn.connect(joueur2).attaquer(1, 1);
      const bateau = await bn.grilles(joueur1.address, 1, 1);
      expect(bateau.coule).to.equal(true);
    });

    it("devrait changer le tour du joueur après une attaque réussie", async function () {
      await bn.connect(joueur1).placerBateau(1, 1);
      await bn.connect(joueur2).attaquer(1, 1);
      expect(await bn.tourDeJoueur1()).to.equal(false);
    });

    it("devrait émettre un événement Attaque avec les bonnes informations", async function () {
      await bn.connect(joueur1).placerBateau(1, 1);
      const tx = await bn.connect(joueur2).attaquer(1, 1);
      const attaqueEvent = await tx.wait(0).then((logs) =>
        logs.events.find((event) => event.event === "Attaque")
      );
      expect(attaqueEvent.args[0]).to.equal(joueur

});