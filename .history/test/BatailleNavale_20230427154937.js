// SPDX-License-Identifier: MIT

const { expect } = require("chai");

describe("BatailleNavale", function() {
  let BatailleNavale;
  let bn;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    [owner, addr1, addr2] = await ethers.getSigners();
    bn = await BatailleNavale.deploy(addr1.address, addr2.address);
    await bn.deployed();
  });

  describe("partieTerminee", function() {
    it("renvoie false lorsque la partie vient de commencer", async function() {
      expect(await bn.partieTerminee()).to.equal(false);
    });

    it("renvoie true lorsque tous les bateaux sont coulés", async function() {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          await bn.attaquer(i, j);
        }
      }
      expect(await bn.partieTerminee()).to.equal(true);
    });
  });

  describe("vainqueur", function() {
    it("renvoie l'adresse de joueur1 lorsque joueur2 a tous ses bateaux coulés", async function() {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (i % 2 === 0) {
            await bn.placerBateau(i, j);
          } else {
            await bn.placerBateau(j, i);
          }
        }
      }
      for (let i = 0; i < 10; i++) {
        await bn.attaquer(i, 0);
      }
      expect(await bn.vainqueur()).to.equal(addr1.address);
    });

    it("renvoie l'adresse de joueur2 lorsque joueur1 a tous ses bateaux coulés", async function() {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (i % 2 === 0) {
            await bn.placerBateau(j, i);
          } else {
            await bn.placerBateau(i, j);
          }
        }
      }
      for (let i = 0; i < 10; i++) {
        await bn.attaquer(i, 0);
      }
      expect(await bn.vainqueur()).to.equal(addr2.address);
    });

    it("renvoie l'adresse 0 lorsque la partie n'est pas terminée", async function() {
      expect(await bn.vainqueur()).to.equal(ethers.constants.AddressZero);
    });
  });
});
