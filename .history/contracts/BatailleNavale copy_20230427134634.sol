// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract BatailleNavale {
    
    enum EtatPartie { EnAttente, EnCours, Terminee }
    enum Case { Vide, Bateau, BateauCoule }
    
    struct Joueur {
        mapping(uint8 => mapping(uint8 => Case)) grille;
        uint8[5] bateaux; // Tableau des tailles de bateaux restants
        bool aJoue;
    }
    
    address public joueur1;
    address public joueur2;
    address public joueurCourant;
    address public joueurAutre;
    EtatPartie public etatPartie = EtatPartie.EnAttente;
    uint8 public nbBateaux = 5;
    uint8 public tailleBateau = 3;
    mapping(address => Joueur) public joueurs;
    
    event BateauPlace(address indexed joueur, uint8 x, uint8 y);
    event AttaqueRecue(address indexed joueur, uint8 x, uint8 y, bool touche);
    event PartieTerminee(address indexed gagnant);

    modifier estEnEtat(EtatPartie _etat) {
        require(etatPartie == _etat, "La partie n'est pas dans l'état attendu");
        _;
    }
    
    modifier estJoueur() {
        require(msg.sender == joueurCourant, "Vous n'êtes pas autorisé à effectuer cette action");
        _;
    }
    
    constructor() {
        joueur1 = msg.sender;
    }
    
    function rejoindrePartie() public {
        require(etatPartie == EtatPartie.EnAttente, "La partie est déjà en cours");
        require(msg.sender != joueur1, "Vous êtes déjà le joueur 1");
        joueur2 = msg.sender;
        joueurCourant = joueur1;
        joueurAutre = joueur2;
        etatPartie = EtatPartie.EnCours;
    }
    
    function placerBateau(uint8 x, uint8 y) public estEnEtat(EtatPartie.EnAttente) {
        require(x < 10 && y < 10, "Position en dehors de la grille");
        Joueur storage joueur = joueurs[msg.sender];
        require(joueur.bateaux.length < nbBateaux, "Vous avez déjà placé tous vos bateaux");
        require(joueur.grille[x][y] == Case.Vide, "Position déjà occupée");
        
        joueur.grille[x][y] = Case.Bateau;
        joueur.bateaux.push(tailleBateau);
        emit BateauPlace(msg.sender, x, y);
        
        if (msg.sender == joueur1 && joueur.bateaux.length == nbBateaux) {
            joueurCourant = joueur2;
            joueurAutre = joueur1;
            tailleBateau--;
        } else if (msg.sender == joueur2 && joueur.bateaux.length == nbBateaux) {
            joueurCourant = joueur1;
            joueurAutre = joueur2;
            etatPartie = EtatPartie.EnCours;
        }
    }
}
