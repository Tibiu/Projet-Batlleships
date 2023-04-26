// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract BatailleNavale {
    
    // On définit une structure pour stocker les coordonnées des bateaux
    struct Bateau {
        uint8 x;
        uint8 y;
        bool coule;
    }
    
    // On définit une grille de 10x10 pour stocker les bateaux
    mapping(uint8 => mapping(uint8 => Bateau)) public grille;
    
    // On définit une fonction pour placer un bateau
    function placerBateau(uint8 x, uint8 y) public {
        grille[x][y] = Bateau(x, y, false);
    }
    
    // On définit une fonction pour attaquer un bateau
    function attaquer(uint8 x, uint8 y) public {
        Bateau storage bateau = grille[x][y];
        bateau.coule = true;
    }
    
    // On définit une fonction pour vérifier si un bateau a été coulé
    function estCoule(uint8 x, uint8 y) public view returns(bool) {
        Bateau storage bateau = grille[x][y];
        return bateau.coule;
    }

    //Permet de vérifier si la partie est terminée ou non (c'est-à-dire si tous les bateaux ont été coulés)
    function estPartieTerminee() public view returns(bool) {
    for (uint8 i = 0; i < 10; i++) {
        for (uint8 j = 0; j < 10; j++) {
            if (!grille[i][j].coule) {
                return false;
            }
        }
    }
    return true;
}

}