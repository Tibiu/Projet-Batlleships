// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BatailleNavale {
    enum EtatPartie {Initialisation, EnCours, Terminee}
    EtatPartie etatPartie;

    struct Bateau {
        uint8 x;
        uint8 y;
        bool coule;
    }

    struct Joueur {
        address adresse;
        mapping(uint8 => mapping(uint8 => Bateau)) grille;
    }

    mapping(address => Joueur) public joueurs;

    address public joueurCourant;
    address public joueurAutre;

    event PartieCommencee(address joueurCourant);
    event BateauPlace(address joueur, uint8 x, uint8 y);
    event AttaqueReçue(address attaquant, uint8 x, uint8 y, bool touche);
    event PartieTerminee(address gagnant);

    modifier estEnEtat(EtatPartie _etat) {
        require(etatPartie == _etat, "La partie n'est pas dans l'état attendu");
        _;
    }

    modifier estJoueur() {
        require(msg.sender == joueurCourant || msg.sender == joueurAutre, "Vous n'êtes pas autorisé à effectuer cette action");
        _;
    }

    function initialiserPartie() public {
        require(etatPartie == EtatPartie.Initialisation, "La partie a déjà été initialisée");

        joueurs[msg.sender].adresse = msg.sender;

        if (joueurCourant == address(0)) {
            joueurCourant = msg.sender;
            emit PartieCommencee(joueurCourant);
        } else if (joueurAutre == address(0)) {
            joueurAutre = msg.sender;
            etatPartie = EtatPartie.EnCours;
        } else {
            revert("La partie est déjà pleine");
        }
    }

    function placerBateau(uint8 x, uint8 y) public estEnEtat(EtatPartie.Initialisation) estJoueur() {
        Joueur storage joueur = joueurs[msg.sender];
        require(joueur.grille[x][y].x == 0 && joueur.grille[x][y].y == 0, "Le bateau a déjà été placé à cette position");
        joueur.grille[x][y] = Bateau(x, y, false);
        emit BateauPlace(msg.sender, x, y);
    }

    function attaquer(uint8 x, uint8 y) public estEnEtat(EtatPartie.EnCours) estJoueur() {
        Joueur storage joueur = joueurs[msg.sender];
        Joueur storage autreJoueur = joueurs[joueurAutre];
        require(!autreJoueur.grille[x][y].coule, "Vous avez déjà attaqué cette position");

        if (autreJoueur.grille[x][y].x == 0 && autreJoueur.grille[x][y].y == 0) {
            emit AttaqueReçue(msg.sender, x, y, false);
        } else {
            autreJoueur.grille[x][y].coule = true;
            bool partieTerminee = true;
            for (uint8 i = 0; i < 10; i++) {
                for (uint8 j = 0; j < 10; j++) {
                    if (autreJoueur.grille[i][j].x != 0 || autreJoueur.grille[i][j].y != 0)
