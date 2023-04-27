// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract BatailleNavale {
    
    struct Bateau {
        uint8 x;
        uint8 y;
        bool coule;
    }

    mapping(uint8 => mapping(uint8 => Bateau)) public grille;
    
    function placerBateau(uint8 x, uint8 y) public {
        grille[x][y] = Bateau(x, y, false);
    }
    
    function attaquer(uint8 x, uint8 y) public {
        Bateau storage bateau = grille[x][y];
        bateau.coule = true;
    }
    
    function Coule(uint8 x, uint8 y) public view returns(bool) {
        Bateau storage bateau = grille[x][y];
        return bateau.coule;
    }

    function PartieTerminee() public view returns(bool) {
    for (uint8 i = 0; i < 10; i++) {
        for (uint8 j = 0; j < 10; j++) {
            if (!grille[i][j].coule) {
                return false;
            }
        }
    }
    return true;
    }
    
    function initialiserPartie() public {
    for(uint8 i = 0; i < 10; i++) {
        for(uint8 j = 0; j < 10; j++) {
            grille[i][j] = Bateau(i, j, false);
        }
    }
    }

    function getGrille() public view returns(string[] memory) {
    string[] memory result = new string[](100);
    for(uint8 i = 0; i < 10; i++) {
        for(uint8 j = 0; j < 10; j++) {
            Bateau storage bateau = grille[i][j];
            string memory info = string(abi.encodePacked("Case (", uintToString(bateau.x), ", ", uintToString(bateau.y), "): "));
            if(bateau.coule) {
                info = string(abi.encodePacked(info, "Coulé"));
            } else {
                info = string(abi.encodePacked(info, "Non coulé"));
            }
            result[i*10 + j] = info;
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

    function tourDuJoueur(address joueur) public view returns(bool) {
        return joueur == joueurActuel;
    }

    function validerPlacementBateau(address joueur, uint8 x, uint8 y, uint8 taille, bool orientation) public returns(bool) {
    // Vérifier si c'est le tour du joueur actuel
    require(tourDuJoueur(joueur), "Ce n'est pas votre tour de jouer.");

    // Vérifier si le bateau rentre dans la grille
    require((orientation && x + taille <= 10) || (!orientation && y + taille <= 10), "Le bateau sort de la grille.");

    // Vérifier si le bateau ne chevauche pas un autre bateau
    if (orientation) {
        for (uint8 i = x; i < x + taille; i++) {
            require(grille[joueur][i][y] == 0, "Il y a déjà un bateau à cette position.");
        }
    } else {
        for (uint8 i = y; i < y + taille; i++) {
            require(grille[joueur][x][i] == 0, "Il y a déjà un bateau à cette position.");
        }
    }

    // Valider le placement du bateau
    if (orientation) {
        for (uint8 i = x; i < x + taille; i++) {
            grille[joueur][i][y] = taille;
        }
    } else {
        for (uint8 i = y; i < y + taille; i++) {
            grille[joueur][x][i] = taille;
        }
    }

    return true;
    }

    function validerTir(address joueur, uint8 x, uint8 y) public view returns(bool) {
        // On vérifie si c'est le tour du joueur actuel
        if (joueur != joueurActuel) {
            return false;
        }
        
        // On vérifie si les coordonnées sont valides
        if (x >= tailleGrille || y >= tailleGrille) {
            return false;
        }
        
        // On vérifie si la case a déjà été touchée
        if (casesTouchees[x][y] || casesManquees[x][y]) {
            return false;
        }
        
        return true;
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


