// 
pragma solidity ^0.8.9;

contract BatailleNavale {
    address public joueur1;
    address public joueur2;
    bool public tourDeJoueur1;
    
    struct Bateau {
        bool coule;
        bool place;
    }

    mapping(address => mapping(uint8 => mapping(uint8 => Bateau))) public grilles;

    event Attaque(address attaquant, uint8 x, uint8 y, bool reussie);

    constructor(address _joueur2) {
        joueur1 = msg.sender;
        joueur2 = _joueur2;
        tourDeJoueur1 = true;
    }

    function placerBateau(uint8 x, uint8 y) public {
        require(grilles[msg.sender][x][y].place == false);//"Ce bateau est déjà placé"
        grilles[msg.sender][x][y].place = true;
    }

    function attaquer(uint8 x, uint8 y) public {
        require(msg.sender != joueur1 && msg.sender != joueur2);//"Vous n'êtes pas autorisé à attaquer"
        require(grilles[msg.sender][x][y].coule == false);//"Ce bateau est déjà coulé"
        bool reussite = false;
        if ((msg.sender == joueur1 && tourDeJoueur1) || (msg.sender == joueur2 && !tourDeJoueur1)) {
            tourDeJoueur1 = !tourDeJoueur1;
            if (grilles[address(uint160(joueur1))][x][y].place) {
                grilles[address(uint160(joueur1))][x][y].coule = true;
                reussite = true;
            }
            if (grilles[address(uint160(joueur2))][x][y].place) {
                grilles[address(uint160(joueur2))][x][y].coule = true;
                reussite = true;
            }
            emit Attaque(msg.sender, x, y, reussite);
        }
    }

    function partieFini() public view returns(bool) {
        bool joueur1Gagnant = true;
        bool joueur2Gagnant = true;
        for (uint8 i = 0; i < 10; i++) {
            for (uint8 j = 0; j < 10; j++) {
                if (grilles[address(uint160(joueur1))][i][j].place && !grilles[address(uint160(joueur1))][i][j].coule) {
                    joueur1Gagnant = false;
                }
                if (grilles[address(uint160(joueur2))][i][j].place && !grilles[address(uint160(joueur2))][i][j].coule) {
                    joueur2Gagnant = false;
                }
            }
        }
        return joueur1Gagnant || joueur2Gagnant;
    }
}
