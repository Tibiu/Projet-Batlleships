const { expect } = require("chai");

describe("Battleship", function() {
  let battleship;
  let player1;
  let player2;

  beforeEach(async function() {
    const Battleship = await ethers.getContractFactory("Battleship");
    battleship = await Battleship.deploy();
    await battleship.deployed();

    // Join game
    player1 = await ethers.getSigner(0);
    await battleship.connect(player1).joinGame();
    player2 = await ethers.getSigner(1);
    await battleship.connect(player2).joinGame();
    await battleship.startGame();

    // Place ships
    await battleship.connect(player1).placeShip(0, 0, 2, true);
    await battleship.connect(player1).placeShip(3, 3, 3, false);
    await battleship.connect(player2).placeShip(5, 5, 4, true);
    await battleship.connect(player2).placeShip(8, 8, 5, false);
  });

  it("should allow player to make a successful attack", async function() {
    // Player 1 attacks Player 2's ship at (5, 5)
    const result = await battleship.connect(player1).attack(5, 5);
    expect(result).to.be.true;
    // Event emitted with hit = true
    const attackEvent = (await battleship.queryFilter("AttackMade"))[0];
    expect(attackEvent.args.hit).to.be.true;
  });

  it("should allow player to make a failed attack", async function() {
    // Player 1 attacks Player 2's empty space at (1, 1)
    const result = await battleship.connect(player1).attack(1, 1);
    expect(result).to.be.false;
    // Event emitted with hit = false
    const attackEvent = (await battleship.queryFilter("AttackMade"))[0];
    expect(attackEvent.args.hit).to.be.false;
  });
});
