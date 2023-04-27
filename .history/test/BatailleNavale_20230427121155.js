const { expect } = require("chai");

describe("BatailleNavale", function() {
  let batailleNavale;

  beforeEach(async function () {
    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    batailleNavale = await BatailleNavale.deploy();
    await batailleNavale.deployed();
  });

  it("Should allow a player to join the game", async function() {
    const [player1, player2] = await ethers.getSigners();

    await batailleNavale.connect(player1).joinGame();
    const playerJoinedEvent = await new Promise(resolve => {
      batailleNavale.once("PlayerJoined", (playerAddress) => {
        resolve(playerAddress);
      });
    });

    expect(playerJoinedEvent).to.equal(player1.address);
    expect(await batailleNavale.playersJoined(player1.address)).to.equal(true);
    expect(await batailleNavale.numPlayers()).to.equal(1);

    await batailleNavale.connect(player2).joinGame();

    expect(await batailleNavale.playersJoined(player2.address)).to.equal(true);
    expect(await batailleNavale.numPlayers()).to.equal(2);
  });

  it("Should not allow more than two players to join the game", async function() {
    const [player1, player2, player3] = await ethers.getSigners();

    await batailleNavale.connect(player1).joinGame();
    await batailleNavale.connect(player2).joinGame();

    await expect(batailleNavale.connect(player3).joinGame()).to.be.revertedWith("Game is full");

    expect(await batailleNavale.numPlayers()).to.equal(2);
  });

  it("Should not allow a player to join the game twice", async function() {
    const [player1, player2] = await ethers.getSigners();

    await batailleNavale.connect(player1).joinGame();

    await expect(batailleNavale.connect(player1).joinGame()).to.be.revertedWith("Player already joined the game");

    expect(await batailleNavale.numPlayers()).to.equal(1);
  });
});

