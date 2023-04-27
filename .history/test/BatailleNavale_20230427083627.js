// Importer les bibliothèques Mocha et Chai
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Décrire le contrat à tester
describe("BatailleNavale", function () {

  // Définir les variables utiles dans les tests
  let batailleNavale;
  let owner;

  // Initialiser le contrat et les variables pour chaque test
  beforeEach(async function () {
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    batailleNavale = await BatailleNavale.deploy();
    await batailleNavale.deployed();
    [owner] = await ethers.getSigners();
  });

  // Premier test : placer un bateau et vérifier s'il est bien placé
  it("devrait placer un bateau et le retrouver", async function () {
    await batailleNavale.placerBateau(5, 5);
    const bateau = await batailleNavale.grille(5, 5);
    expect(bateau.x).to.equal(5);
    expect(bateau.y).to.equal(5);
    expect(bateau.coule).to.equal(false);
  });

  // Deuxième test : attaquer un bateau et vérifier s'il est bien coulé
  it("devrait couler un bateau", async function () {
    await batailleNavale.placerBateau(5, 5);
    await batailleNavale.attaquer(5, 5);
    const bateau = await batailleNavale.grille(5, 5);
    expect(bateau.coule).to.equal(true);
  });

  // Troisième test : vérifier si un bateau est coulé
  it("devrait retourner si un bateau est coulé ou non", async function () {
    await batailleNavale.placerBateau(5, 5);
    await batailleNavale.attaquer(5, 5);
    const estCoule = await batailleNavale.Coule(5, 5);
    expect(estCoule).to.equal(true);
  });
});
