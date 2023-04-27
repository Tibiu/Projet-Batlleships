// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract BatailleNavale {
    
struct Bateau {
    uint8 x;
    uint8 y;
    bool coule;
}

mapping(uint8 => mapping(uint8 => Bateau)) public grille;

uint8 constant tailleGrille = 10;
uint8 private nombreBateauxPlaces;
address private joueurActuel;
mapping(address => mapping(uint8 => mapping(uint8 => uint8))) private grilleBateaux;
mapping(address => mapping(uint8 => mapping(uint8 => bool))) private casesTouchees;
mapping(address => mapping(uint8 => mapping(uint8 => bool))) private casesManquees;

function placerBateau(uint8 x, uint8 y) public {
    grille[x][y] = Bateau(x, y, false);
}

function attaquer(uint8 x, uint8 y) public {
    Bateau storage bateau = grille[x][y];
    bateau.coule = true;
}

function Coule(uint8 x, uint8 y) public view returns (bool) {
    Bateau storage bateau = grille[x][y];
    return bateau.coule;
}

function PartieTerminee() public view returns (bool) {
    for (uint8 i = 0; i < tailleGrille; i++) {
        for (uint8 j = 0; j < tailleGrille; j++) {
            if (!grille[i][j].coule) {
                return false;
            }
        }
    }
    return true;
}

function initialiserPartie() public {
    for (uint8 i = 0; i < tailleGrille; i++) {
        for (uint8 j = 0; j < tailleGrille; j++) {
            grille[i][j] = Bateau(i, j, false);
        }
    }
}

function getGrille() public view returns (string[] memory) {
    string[] memory result = new string[](100);
    for (uint8 i = 0; i < tailleGrille; i++) {
        for (uint8 j = 0; j < tailleGrille; j++) {
            Bateau storage bateau = grille[i][j];
            string memory info = string(abi.encodePacked("Case (", uintToString(bateau.x), ", ", uintToString(bateau.y), "): "));
            if (bateau.coule) {
                info = string(abi.encodePacked(info, "Coulé"));
            } else {
                info = string(abi.encodePacked(info, "Non coulé"));
            }
            result[i * tailleGrille + j] = info;
        }
    }
    return result;
}

function uintToString(uint8 v) internal pure returns (string memory) {
    if (v == 0) {
        return "0";
    }
    uint8 digits = 0;
    uint8 temp = v;
    while (temp > 0) {
        digits++;
        temp /= 10;
    }
    bytes memory buffer = new bytes(digits);
    while (v > 0) {
        digits -= 1;
        buffer[digits] = bytes1(uint8(48 + v % 10));
        v /= 10;
    }
    return string(buffer);
}

function tourDuJoueur(address joueur) public view returns (bool) {
    return joueur == joueurActuel;
}
    function validerPlacementBateau(address joueur, uint8 x, uint8 y, uint8 taille, bool orientation) public returns(bool) {
    require(joueur == msg.sender, "Vous n'êtes pas autorisé à placer des bateaux pour ce joueur.");
    require(taille > 0 && taille <= 5, "La taille du bateau doit être comprise entre 1 et 5.");
    require(x >= 0 && x <= 9 && y >= 0 && y <= 9, "Coordonnées invalides.");
    require(grille[joueur][x][y].etat == EtatCase.VIDE, "La case est déjà occupée.");
    
    // Vérifier si le bateau rentre dans la grille
    if (orientation == true) { // horizontal
        require(x + taille <= 10, "Le bateau ne rentre pas dans la grille.");
        for (uint8 i = x; i < x + taille; i++) {
            require(grille[joueur][i][y].etat == EtatCase.VIDE, "Le bateau chevauche un autre bateau.");
        }
    } else { // vertical
        require(y + taille <= 10, "Le bateau ne rentre pas dans la grille.");
        for (uint8 j = y; j < y + taille; j++) {
            require(grille[joueur][x][j].etat == EtatCase.VIDE, "Le bateau chevauche un autre bateau.");
        }
    }
    
    // Placer le bateau sur la grille
    if (orientation == true) { // horizontal
        for (uint8 i = x; i < x + taille; i++) {
            grille[joueur][i][y].etat = EtatCase.BATEAU;
        }
    } else { // vertical
        for (uint8 j = y; j < y + taille; j++) {
            grille[joueur][x][j].etat = EtatCase.BATEAU;
        }
    }
    
    return true;
    }

    function getTailleBateau(uint8 idBateau) public view returns (uint8) {
        require(idBateau < bateaux.length, "ID de bateau invalide");
        return bateaux[idBateau].taille;
    }

    function getNombreBateaux() public view returns(uint8) {
    return nombreBateaux;
    }




}


