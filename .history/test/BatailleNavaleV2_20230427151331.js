const { expect } = require("chai");

describe("BattleShip", function () {
  let battleShip;
  let player1;
  let player2;

  beforeEach(async function () {
    const BattleShip = await ethers.getContractFactory("BattleShip");
    [player1, player2] = await ethers.getSigners();
    battleShip = await BattleShip.deploy(player1.address, player2.address);
    await battleShip.deployed();
  });

  it("Permet de lancer une partie avec 2 joueurs", async function () {
    expect(await battleShip.player1()).to.equal(player1.address);
    expect(await battleShip.player2()).to.equal(player2.address);
  });

  it("should allow players to take turns", async function () {
    await battleShip.takeTurn(0, 0);
    await battleShip.connect(player2).takeTurn(0, 1);
    expect(await battleShip.player1Board(0, 0)).to.equal(1);
    expect(await battleShip.player2Board(0, 1)).to.equal(1);
  });

  it("should not allow non-players to take turns", async function () {
    const nonPlayer = await ethers.getSigner();
    await expect(battleShip.connect(nonPlayer).takeTurn(0, 0)).to.be.revertedWith("You are not a player in this game.");
  });

  it("should not allow players to hit the same position twice", async function () {
    await battleShip.takeTurn(0, 0);
    await expect(battleShip.takeTurn(0, 0)).to.be.revertedWith("This position has already been hit.");
  });

  it("should emit the TurnTaken event when a turn is taken", async function () {
    const tx = await battleShip.takeTurn(0, 0);
    const receipt = await tx.wait();
    const event = receipt.events[0];
    expect(event.event).to.equal("TurnTaken");
    expect(event.args[0]).to.equal(player1.address);
    expect(event.args[1]).to.equal(0);
    expect(event.args[2]).to.equal(0);
    expect(event.args[3]).to.equal(false);
  });

  it("should emit the GameOver event when the game is over", async function () {
    await battleShip.takeTurn(0, 0);
    await battleShip.connect(player2).takeTurn(0, 1);
    await battleShip.takeTurn(1, 0);
    await battleShip.connect(player2).takeTurn(0, 2);
    await battleShip.takeTurn(2, 0);
    const tx = await battleShip.connect(player2).takeTurn(0, 3);
    const receipt = await tx.wait();
    const event = receipt.events[0];
    expect(event.event).to.equal("GameOver");
    expect(event.args[0]).to.equal(player2.address);
  });

  it("should return true from isGameOver when the game is over", async function () {
    await battleShip.takeTurn(0, 0);
    await battleShip.connect(player2).takeTurn(0, 1);
    await battleShip.takeTurn(1, 0);
    await battleShip.connect(player2).takeTurn(0, 2);
    await battleShip.takeTurn(2, 0);
    await battleShip.connect(player2).takeTurn(0, 3);
    expect(await battleShip.isGameOver()).to.equal(true);
  });

});