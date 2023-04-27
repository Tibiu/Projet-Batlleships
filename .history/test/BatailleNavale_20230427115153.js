const { expect } = require("chai");

describe("BatailleNavale", function () {
  let batailleNavale;

  beforeEach(async function () {
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    batailleNavale = await BatailleNavale.deploy();
    await batailleNavale.deployed();
  });

  it("devrait finir la partie lorsque tous les bateaux sont coulés", async function () {
    await batailleNavale.placerBateau(0, 0);
    await batailleNavale.attaquer(0, 0);
    expect(await batailleNavale.gameFinished()).to.equal(false);

    await batailleNavale.placerBateau(0, 1);
    await batailleNavale.attaquer(0, 1);
    expect(await batailleNavale.gameFinished()).to.equal(false);

    await batailleNavale.placerBateau(0, 2);
    await batailleNavale.attaquer(0, 2);
    expect(await batailleNavale.gameFinished()).to.equal(true);
  });

  it("devrait retourner vrai si le bateau est coulé", async function () {
    await batailleNavale.placerBateau(0, 0);
    expect(await batailleNavale.estCoule(0, 0)).to.equal(false);

    await batailleNavale.attaquer(0, 0);
    expect(await batailleNavale.estCoule(0, 0)).to.equal(true);
  });
});
