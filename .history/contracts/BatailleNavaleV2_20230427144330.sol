// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract BatailleNavale {
   enum EtatPartie {NonDemarree, EnCours, Terminee}
EtatPartie public etatPartie;

struct Bateau {
    uint8 x;
    uint8 y;
    bool coule;
}

struct Joueur {
    address adresse;
    mapping(uint8 => mapping(uint8 => Bateau)) grille;
}

Joueur public joueur1;
Joueur public joueur2;
address public joueurEnCours;

modifier estEnEtat(EtatPartie _etat) {
    require(etatPartie == _etat, "La partie n'est pas dans le bon état pour cette action.");
    _;
}

modifier estJoueur() {
    require(msg.sender == joueurEnCours, "Ce n'est pas votre tour de jouer.");
    _;
}

constructor() {
    etatPartie = EtatPartie.NonDemarree;
}

function demarrerPartie(address _joueur1, address _joueur2) public estEnEtat(EtatPartie.NonDemarree) {
    require(msg.sender == _joueur1 || msg.sender == _joueur2, "Seuls les joueurs peuvent démarrer la partie.");
    joueur1.adresse = _joueur1;
    joueur2.adresse = _joueur2;
    etatPartie = EtatPartie.EnCours;
    joueurEnCours = _joueur1;
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
}