const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('BatailleNavale', function () {
  let batailleNavale;

  beforeEach(async function () {
    const BatailleNavale = await ethers.getContractFactory('BatailleNavale');
    batailleNavale = await BatailleNavale.deploy(accounts[1]);
    await batailleNavale.deployed();
  });

  it('rejette l\'ajout incorrect d\'un bateau sur la grille', async function () {
    // Placez un bateau sur la grille avec les coordonnées x=5 et y=5
    await batailleNavale.placerBateau(5, 5);

    // Essayez de placer un bateau sur la même case x=5 et y=5
    await expect(batailleNavale.placerBateau(5, 5)).to.be.revertedWith("Ce bateau est déjà placé");

    // Essayez de placer un bateau sur une case déjà occupée
    await expect(batailleNavale.placerBateau(5, 5)).to.be.revertedWith("Ce bateau est déjà placé");
  });
});
