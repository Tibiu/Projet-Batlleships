const BatailleNavale = artifacts.require("BatailleNavale");

contract("BatailleNavale", async accounts => {
  it("devrait permettre le déploiement du contrat avec deux joueurs", async () => {
    const joueur1 = accounts[0];
    const joueur2 = accounts[1];
    const batailleNavale = await BatailleNavale.new(joueur2, { from: joueur1 });

    assert.equal(await batailleNavale.joueur1(), joueur1);
    assert.equal(await batailleNavale.joueur2(), joueur2);
  });
});