const { expect } = require("chai");

describe("BatailleNavale", function() {
  it("devrait permettre de terminer la partie", async function() {
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    const batailleNavale = await BatailleNavale.deploy();

    // placer des bateaux
    await batailleNavale.placerBateau(0, 0);
    await batailleNavale.placerBateau(1, 0);

    // vérifier qu'ils ne sont pas coulés
    expect(await batailleNavale.estCoule(0, 0)).to.equal(false);
    expect(await batailleNavale.estCoule(1, 0)).to.equal(false);

    // attaquer les bateaux
    await batailleNavale.attaquer(0, 0);
    await batailleNavale.attaquer(1, 0);

    // vérifier qu'ils sont coulés
    expect(await batailleNavale.estCoule(0, 0)).to.equal(true);
    expect(await batailleNavale.estCoule(1, 0)).to.equal(true);
    
    // vérifier que la partie est terminée
    expect(await batailleNavale.partieTerminee()).to.equal(true);
  });
});
