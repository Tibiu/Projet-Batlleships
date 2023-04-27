const { expect } = require("chai");

describe("BatailleNavale", function() {
  it("devrait placer un bateau sur la grille", async function() {
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    const batailleNavale = await BatailleNavale.deploy();

    const x = 2;
    const y = 4;
    await batailleNavale.placerBateau(x, y);

    const bateau = await batailleNavale.grille(x, y);
    expect(bateau.x).to.equal(x);
    expect(bateau.y).to.equal(y);
    expect(bateau.coule).to.be.false;
  });
});
