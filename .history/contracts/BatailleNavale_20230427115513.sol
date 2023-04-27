// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract BatailleNavale {
    
    struct Bateau {
    uint8 x;
    uint8 y;
    bool coule;
}

mapping(uint8 => mapping(uint8 => Bateau)) public grille;

bool public gameOver;

function placerBateau(uint8 x, uint8 y) public {
    grille[x][y] = Bateau(x, y, false);
}

function attaquer(uint8 x, uint8 y) public {
    Bateau storage bateau = grille[x][y];
    bateau.coule = true;
    checkGameOver();
}

function estCoule(uint8 x, uint8 y) public view returns(bool) {
    Bateau storage bateau = grille[x][y];
    return bateau.coule;
}

function checkGameOver() internal {
    bool joueur1Perdant = true;
    bool joueur2Perdant = true;
    for (uint8 i = 0; i < 10; i++) {
        for (uint8 j = 0; j < 10; j++) {
            if (!grille[i][j].coule) {
                if (i < 5) {
                    joueur2Perdant = false;
                } else {
                    joueur1Perdant = false;
                }
            }
        }
    }
    if (joueur1Perdant || joueur2Perdant) {
        gameOver = true;
    }
}
}