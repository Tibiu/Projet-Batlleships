// const { expect } = require("chai");

// describe("BattleShip", function () {
//   let battleShip;
//   let player1;
//   let player2;

//   beforeEach(async function () {
//     const BattleShip = await ethers.getContractFactory("BattleShip");
//     [player1, player2] = await ethers.getSigners();
//     battleShip = await BattleShip.deploy(player1.address, player2.address);
//     await battleShip.deployed();
//   });

//   it("Permet de lancer une partie avec 2 joueurs", async function () {
//     expect(await battleShip.player1()).to.equal(player1.address);
//     expect(await battleShip.player2()).to.equal(player2.address);
//   });

//   it("Permet aux joueurs de jouer à tour de rôle", async function () {
//     await battleShip.takeTurn(0, 0);
//     await battleShip.connect(player2).takeTurn(0, 1);
//     expect(await battleShip.player1Board(0, 0)).to.equal(1);
//     expect(await battleShip.player2Board(0, 1)).to.equal(1);
//   });

//   it("Permet pas aux joueurs de toucher 2 fois la même position", async function () {
//     await battleShip.takeTurn(0, 0);
//     await expect(battleShip.takeTurn(0, 0)).to.be.revertedWith("This position has already been hit.");
//   });

//   it("Permet de finir une partie", async function () {
//     await battleShip.takeTurn(0, 0);
//     await battleShip.connect(player2).takeTurn(0, 1);
//     await battleShip.takeTurn(1, 0);
//     await battleShip.connect(player2).takeTurn(0, 2);
//     await battleShip.takeTurn(2, 0);
//     const tx = await battleShip.connect(player2).takeTurn(0, 3);
//     const receipt = await tx.wait();
//     const event = receipt.events[0];
//     expect(event.event).to.equal("GameOver");
//     expect(event.args[0]).to.equal(player2.address);
//   });

//   it("Permet de finir une partie", async function () {
//     await battleShip.takeTurn(0, 0);
//     await battleShip.connect(player2).takeTurn(0, 1);
//     await battleShip.takeTurn(1, 0);
//     await battleShip.connect(player2).takeTurn(0, 2);
//     await battleShip.takeTurn(2, 0);
//     await battleShip.connect(player2).takeTurn(0, 3);
//     expect(await battleShip.isGameOver()).to.equal(true);
//   });

// });