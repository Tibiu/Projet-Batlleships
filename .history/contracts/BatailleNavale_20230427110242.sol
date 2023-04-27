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
    bool public tourDeJoueur1;

    event Attaque(address attaquant, uint8 x, uint8 y, bool reussie);

    constructor(address _joueur2) {
        joueur1 = msg.sender;
        joueur2 = _joueur2;
        tourDeJoueur1 = true;
    }

    function placerBateau(uint8 x, uint8 y) public {
        require(grille[x][y].x == 0 && grille[x][y].y == 0);
        grille[x][y] = Bateau(x, y, false);
    }
    
    function attaquer(uint8 x, uint8 y) public {
        require(msg.sender == joueur1 || msg.sender == joueur2);
        require(grille[x][y].x != 0 || grille[x][y].y != 0);
        require(!grille[x][y].coule);
        bool reussite = false;
        if ((msg.sender == joueur1 && tourDeJoueur1) || (msg.sender == joueur2 && !tourDeJoueur1)) {
            tourDeJoueur1 = !tourDeJoueur1;
            grille[x][y].coule = true;
            reussite = true;
            emit Attaque(msg.sender, x, y, reussite);
        }
    }

    function estCoule(uint8 x, uint8 y) public view returns(bool) {
        Bateau storage bateau = grille[x][y];
        return bateau.coule;
    }

    function partieTerminee() public view returns(bool) {
        bool joueur1Gagnant = true;
        bool joueur2Gagnant = true;
        for (uint8 i = 0; i < 10; i++) {
            for (uint8 j = 0; j < 10; j++) {
                if (grille[i][j].x != 0 || grille[i][j].y != 0) {
                    if (!grille[i][j].coule) {
                        if (msg.sender == joueur1) {
                            joueur1Gagnant = false;
                        } else if (msg.sender == joueur2) {
                            joueur2Gagnant = false;
                        }
                    }
                }
            }
        }
        if (joueur1Gagnant) {
            return msg.sender == joueur1;
        } else if (joueur2Gagnant) {
            return msg.sender == joueur2;
        } else {
            return false;
        }
    }
}
