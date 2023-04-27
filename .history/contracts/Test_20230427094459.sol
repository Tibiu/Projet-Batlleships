// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BatailleNavale {
    
    struct Bateau {
        uint8 x;
        uint8 y;
        bool coule;
    }

    mapping(address => mapping(uint8 => mapping(uint8 => Bateau))) public grilles;
    mapping(address => bool) public joueurs;
    address public joueurCourant;
    
    constructor(address joueur1, address joueur2) {
        joueurs[joueur1] = true;
        joueurs[joueur2] = true;
        joueurCourant = joueur1;
    }
    
    function placerBateau(uint8 x, uint8 y) public {
        require(joueurs[msg.sender], "Vous ne pouvez pas placer de bateau.");
        require(!grilles[msg.sender][x][y].coule, "Cette case est déjà occupée.");
        grilles[msg.sender][x][y] = Bateau(x, y, false);
    }
    
    function attaquer(uint8 x, uint8 y) public {
        require(joueurs[msg.sender], "Vous ne pouvez pas attaquer.");
        require(!grilles[msg.sender][x][y].coule, "Cette case a déjà été attaquée.");
        address adversaire = joueurCourant == msg.sender ? autreJoueur() : joueurCourant;
        grilles[adversaire][x][y].coule = true;
        if (estPartieTerminee(adversaire)) {
            // Le joueur courant a gagné
        } else {
            joueurCourant = adversaire;
        }
    }
    
    function estPartieTerminee(address joueur) private view returns (bool) {
        for (uint8 x = 0; x < 10; x++) {
            for (uint8 y = 0; y < 10; y++) {
                if (!grilles[joueur][x][y].coule) {
                    return false;
                }
            }
        }
        return true;
    }
    
    function autreJoueur() private view returns (address) {
        for (address joueur : joueurs) {
            if (joueur != joueurCourant) {
                return joueur;
            }
        }
    }
}
