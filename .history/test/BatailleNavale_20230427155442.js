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

  describe("Vainqueur", function() {
    it("Renvoie l'adresse de joueur1 lorsque joueur2 a tous ses bateaux coulés", async function() {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (i % 2 === 0) {
            await bnInstance.placerBateau(i, j);
          } else {
            await bnInstance.placerBateau(j, i);
          }
        }
      }
      for (let i = 0; i < 10; i++) {
        await bn.attaquer(i, 0);
      }
      expect(await bnInstance.vainqueur()).to.equal(addr1.address);
    });

    it("Renvoie l'adresse de joueur2 lorsque joueur1 a tous ses bateaux coulés", async function() {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (i % 2 === 0) {
            await bnInstance.placerBateau(j, i);
          } else {
            await bnInstance.placerBateau(i, j);
          }
        }
      }
      for (let i = 0; i < 10; i++) {
        await bnInstance.attaquer(i, 0);
      }
      expect(await bnInstance.vainqueur()).to.equal(addr2.address);
    });

    it("Renvoie l'adresse 0 lorsque la partie n'est pas terminée", async function() {
      expect(await bnInstance.vainqueur()).to.equal(ethers.constants.AddressZero);
    });
  });
});
