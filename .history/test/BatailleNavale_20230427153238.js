const { expect } = require("chai");

describe("BatailleNavale", function () {
  let bn;

  beforeEach(async function () {
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    bn = await BatailleNavale.deploy();
    await bn.deployed();
  });

  it("devrait retourner le vainqueur", async function () {
    // Placez deux bateaux pour simuler une partie
    await bn.placerBateau(0, 0);
    await bn.placerBateau(0, 1);

    // Attaquez les deux positions pour couler les bateaux
    await bn.attaquer(0, 0);
    await bn.attaquer(0, 1);

    // Vérifiez que la partie est terminée et que le vainqueur est défini
    expect(await bn.partieTerminee()).to.equal(true);
    expect(await bn.vainqueur()).to.equal(owner.address);
  });
});