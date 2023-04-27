const { expect } = require("chai");

describe("BatailleNavale", function() {
  let batailleNavale;

  beforeEach(async function () {
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    batailleNavale = await BatailleNavale.deploy();
    await batailleNavale.deployed();
  });

  it("Permet de placer un bateau sur la grille", async function() {
    await batailleNavale.placerBateau(0, 0);
    const bateau = await batailleNavale.grille(0, 0);
    expect(bateau.x).to.equal(0);
    expect(bateau.y).to.equal(0);
    expect(bateau.coule).to.equal(false);
  });

  it("Permet de couler un bateau", async function() {
    await batailleNavale.placerBateau(0, 0);
    await batailleNavale.attaquer(0, 0);
    const coule = await batailleNavale.estCoule(0, 0);
    expect(coule).to.equal(true);
  });

  it("Permet de ne pas couler un bateau non présent", async function() {
    const coule = await batailleNavale.estCoule(0, 0);
    expect(coule).to.equal(false);
  });

  it("Permet de nepas couler un bateau non touché", async function() {
    await batailleNavale.placerBateau(0, 0);
    const coule = await batailleNavale.estCoule(0, 0);
    expect(coule).to.equal(false);
  });
  
});
