const BatailleNavale = artifacts.require("BatailleNavale");

contract("BatailleNavale", (accounts) => {
  it("devrait déterminer le vainqueur correctement", async () => {
    const instance = await BatailleNavale.deployed();

    // Place des bateaux
    await instance.placerBateau(0, 0, { from: accounts[0] });
    await instance.placerBateau(0, 1, { from: accounts[0] });
    await instance.placerBateau(0, 2, { from: accounts[0] });

    await instance.placerBateau(9, 9, { from: accounts[1] });
    await instance.placerBateau(8, 9, { from: accounts[1] });
    await instance.placerBateau(7, 9, { from: accounts[1] });

    // Attaque
    await instance.attaquer(0, 0, { from: accounts[1] });
    await instance.attaquer(0, 1, { from: accounts[1] });
    await instance.attaquer(0, 2, { from: accounts[1] });
    await instance.attaquer(9, 9, { from: accounts[0] });
    await instance.attaquer(8, 9, { from: accounts[0] });
    await instance.attaquer(7, 9, { from: accounts[0] });

    // Détermination du vainqueur
    const gagnant = await instance.determinerVainqueur();
    assert.equal(gagnant, accounts[0], "Le joueur 1 devrait être le gagnant");
  });
});
