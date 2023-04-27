const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatailleNavale", function () {
  let bn, joueur1, joueur2;

  beforeEach(async () => {
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    [joueur1, joueur2] = await ethers.getSigners();
    bn = await BatailleNavale.deploy(joueur2.address);
    await bn.deployed();
  });

  it("devrait placer un bateau avec succès", async function () {
    const x = 1;
    const y = 2;
    await bn.connect(joueur1).placerBateau(x, y);
    expect(await bn.grilles(joueur1.address, x, y)).to.deep.equal([false, true]);
  });

  it("ne devrait pas placer un bateau sur la même position", async function () {
    const x = 3;
    const y = 4;
    await bn.connect(joueur1).placerBateau(x, y);
    await expect(bn.connect(joueur1).placerBateau(x, y)).to.be.revertedWith("Ce bateau est déjà placé");
  });

  it("devrait attaquer avec succès", async function () {
    const x = 5;
    const y = 6;
    await bn.connect(joueur2).placerBateau(x, y);
    await bn.connect(joueur1).attaquer(x, y);
    expect(await bn.grilles(joueur2.address, x, y)).to.deep.equal([true, true]);
  });

  it("ne devrait pas attaquer sur une position déjà coulée", async function () {
    const x = 7;
    const y = 8;
    await bn.connect(joueur2).placerBateau(x, y);
    await bn.connect(joueur1).attaquer(x, y);
    await expect(bn.connect(joueur1).attaquer(x, y)).to.be.revertedWith("Ce bateau est déjà coulé");
  });

  it("devrait terminer la partie", async function () {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        await bn.connect(joueur1).placerBateau(i, j);
        await bn.connect(joueur2).placerBateau(i, j);
      }
    }
    expect(await bn.partieFini()).to.be.true;
  });
});
