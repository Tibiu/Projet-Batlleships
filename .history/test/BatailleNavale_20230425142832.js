// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "remix_tests.sol"; // Outil de tests pour Remix
import "../contracts/BatailleNavale.sol";

contract BatailleNavaleTest {
    
    BatailleNavale batailleNavale;
    
    function beforeAll() public {
        batailleNavale = new BatailleNavale();
    }
    
    function testPlacerBateau() public {
        batailleNavale.placerBateau(0, 0);
        BatailleNavale.Bateau memory bateau = batailleNavale.grille(0, 0);
        Assert.equal(bateau.x, uint8(0), "Le bateau devrait être placé en (0, 0)");
        Assert.equal(bateau.y, uint8(0), "Le bateau devrait être placé en (0, 0)");
    }
    
    function testAttaquer() public {
        batailleNavale.placerBateau(0, 0);
        batailleNavale.attaquer(0, 0);
        bool estCoule = batailleNavale.estCoule(0, 0);
        Assert.equal(estCoule, true, "Le bateau devrait être coulé");
    }
}
