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

}


}