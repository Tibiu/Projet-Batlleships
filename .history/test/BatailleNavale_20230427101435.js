// Importer les bibliothèques Mocha et Chai
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Importation de l'interface du contrat
const BatailleNavale = artifacts.require("BatailleNavale");

// Déclaration du test
describe("BatailleNavale", function() {
  // Déclaration des variables pour les adresses des joueurs
  let joueur1, joueur2;

  // Initialisation des adresses avant chaque test
  beforeEach(async function() {
    const accounts = await web3.eth.getAccounts();
    joueur1 = accounts[0];
    joueur2 = accounts[1];
  });

  // Test de placement de bateau
  it("devrait permettre à un joueur de placer un bateau sur sa grille", async function() {
    const batailleNavale = await BatailleNavale.new(joueur1, joueur2);
    await batailleNavale.placerBateau(0, 0, {from: joueur1});
    const bateau = await batailleNavale.grilles(joueur1, 0, 0);
    assert.equal(bateau.x, 0);
    assert.equal(bateau.y, 0);
    assert.equal(bateau.coule, false);
  });

  // Test d'attaque
  it("devrait permettre à un joueur de tirer sur la grille de l'adversaire", async function() {
    const batailleNavale = await BatailleNavale.new(joueur1, joueur2);
    await batailleNavale.placerBateau(0, 0, {from: joueur1});
    await batailleNavale.attaquer(0, 0, {from: joueur2});
    const bateau = await batailleNavale.grilles(joueur1, 0, 0);
    assert.equal(bateau.coule, true);
  });
});
