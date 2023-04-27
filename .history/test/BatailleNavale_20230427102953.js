const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("BatailleNavale", function () {
  let bn, joueur1, joueur2;

  beforeEach(async function () {
    [joueur1, joueur2] = await ethers.getSigners();

    const BatailleNavale = await ethers.getContractFactory("BatailleNavale");
    bn = await BatailleNavale.connect(joueur1).deploy(joueur2.address);
    await bn.deployed();
  });

  it("should place a boat", async function () {
    await bn.connect(joueur1).placerBateau(1, 1);
    expect(await bn.grilles(joueur1.address, 1, 1)).to.deep.equal({
      coule: false,
      place: true,
    });
  });  });