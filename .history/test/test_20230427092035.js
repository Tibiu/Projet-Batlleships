const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatailleNavale", function () {

  let BatailleNavale;
  let batailleNavale;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    batailleNavale = await BatailleNavale.connect(owner).deploy();
  });

  describe("placerBateau", function () {
    it("doit placer un bateau sur la grille", async function () {
      await batailleNavale.connect(player1).placerBateau(0, 0);
      const bateau = await batailleNavale.grille(0, 0);
      expect(bateau.x).to.equal(0);
      expect(bateau.y).to.equal(0);
      expect(bateau.coule).to.equal(false);
    });
  });

  describe("attaquer", function () {
    it("doit couler le bateau", async function () {
      await batailleNavale.connect(player1).placerBateau(0, 0);
      await batailleNavale.connect(player2).attaquer(0, 0);
      const bateau = await batailleNavale.grille(0, 0);
      expect(bateau.coule).to.equal(true);
    });
  });

  describe("Coule", function () {
    it("doit renvoyer true si le bateau est coulé", async function () {
      await batailleNavale.connect(player1).placerBateau(0, 0);
      await batailleNavale.connect(player2).attaquer(0, 0);
      const coule = await batailleNavale.Coule(0, 0);
      expect(coule).to.equal(true);
    });

    it("doit renvoyer false si le bateau n'est pas coulé", async function () {
      await batailleNavale.connect(player1).placerBateau(0, 0);
      const coule = await batailleNavale.Coule(0, 0);
      expect(coule).to.equal(false);
    });
  });

  describe("PartieTerminee", function () {
    it("doit renvoyer true si tous les bateaux sont coulés", async function () {
      await batailleNavale.connect(player1).placerBateau(0, 0);
      await batailleNavale.connect(player2).attaquer(0, 0);
      const terminee = await batailleNavale.PartieTerminee();
      expect(terminee).to.equal(true);
    });

    it("doit renvoyer false si tous les bateaux ne sont pas coulés", async function () {
      await batailleNavale.connect(player1).placerBateau(0, 0);
      await batailleNavale.connect(player2).attaquer(0, 0);
      await batailleNavale.connect(player1).placerBateau(1, 0);
      const terminee = await batailleNavale.PartieTerminee();
      expect(terminee).to.equal(false);
    });
  });

  describe("initialiserPartie", function () {
    it("doit initialiser la grille avec des bateaux non coulés",
