// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract BatailleNavale {
    
struct Bateau {
    uint8 x;
    uint8 y;
    bool coule;
}

mapping(uint8 => mapping(uint8 => Bateau)) public grille;
address public joueur1;
address public joueur2;

constructor(address _joueur1, address _joueur2) {
    joueur1 = _joueur1;
    joueur2 = _joueur2;
}

function placerBateau(uint8 x, uint8 y) public {
    grille[x][y] = Bateau(x, y, false);
}

function attaquer(uint8 x, uint8 y) public {
    Bateau storage bateau = grille[x][y];
    bateau.coule = true;
}

function estCoule(uint8 x, uint8 y) public view returns(bool) {
    Bateau storage bateau = grille[x][y];
    return bateau.coule;
}

function partieTerminee() public view returns(bool) {
    for (uint8 i = 0; i < 10; i++) {
        for (uint8 j = 0; j < 10; j++) {
            if (!grille[i][j].coule) {
                return false;
            }
        }
    }
    return true;
}

function vainqueur() public view returns (address) {
    if (partieTerminee()) {
        uint8 joueur1Coules = 0;
        uint8 joueur2Coules = 0;
        for (uint8 i = 0; i < 10; i++) {
            for (uint8 j = 0; j < 10; j++) {
                if (grille[i][j].coule) {
                    if (joueur1 == msg.sender) {
                        joueur1Coules++;
                    } else if (joueur2 == msg.sender) {
                        joueur2Coules++;
                    }
                }
            }
        }
        if (joueur1Coules > joueur2Coules) {
            return joueur2;
        } else if (joueur1Coules < joueur2Coules) {
            return joueur1;
        } else {
            return address(0);
        }
    } else {
        return address(0);
    }
}
}
