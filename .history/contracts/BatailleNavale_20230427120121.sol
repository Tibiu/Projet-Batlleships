// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Battleship {
    
    struct Ship {
        uint8 x;
        uint8 y;
        uint8 length;
        bool horizontal;
    }

    mapping(address => Ship[]) public playerShipsMap;
    
    address[] public playerAddresses;
    mapping(address => bool) public playersJoined;
    uint8 public numPlayers;
    uint8 public numShipsPlaced;
    bool public gameStarted;
    
    event PlayerJoined(address player);
    event GameStarted();
    event ShipPlaced(address player, uint8 x, uint8 y, uint8 length, bool horizontal);
    event AttackMade(address player, uint8 x, uint8 y, bool hit);

    function joinGame() public {
        require(numPlayers < 2, "Game is full");
        require(!playersJoined[msg.sender], "Player already joined the game");
        playersJoined[msg.sender] = true;
        playerAddresses.push(msg.sender);
        numPlayers++;
        emit PlayerJoined(msg.sender);
    }

    function startGame() public {
        require(numPlayers == 2, "Not enough players");
        require(!gameStarted, "Game already started");
        gameStarted = true;
        emit GameStarted();
    }
    
    function placeShip(uint8 _x, uint8 _y, uint8 _length, bool _horizontal) public {
        require(gameStarted, "Game not started yet");
        require(playersJoined[msg.sender], "Player not joined the game");
        require(numShipsPlaced < 10, "All ships have been placed");
        require(_length > 0 && _length < 6, "Invalid ship length");
        require(_x < 10 && _y < 10, "Ship placed outside of game board");
        if (_horizontal) {
            require(_x + _length <= 10, "Ship placed outside of game board");
        } else {
            require(_y + _length <= 10, "Ship placed outside of game board");
        }
        Ship memory newShip = Ship(_x, _y, _length, _horizontal);
        playerShipsMap[msg.sender].push(newShip);
        numShipsPlaced++;
        emit ShipPlaced(msg.sender, _x, _y, _length, _horizontal);
    }
    
    function attack(uint8 _x, uint8 _y) public returns (bool) {
        require(gameStarted, "Game not started yet");
        require(playersJoined[msg.sender], "Player not joined the game");
        require(_x < 10 && _y < 10, "Attack outside of game board");
        bool hit = false;
        for (uint i = 0; i < playerAddresses.length; i++) {
            Ship[] storage ships = playerShipsMap[playerAddresses[i]];
            for (uint j = 0; j < ships.length; j++) {
                if ((ships[j].x == _x && ships[j].horizontal) || (ships[j].y == _y && !ships[j].horizontal)) {
                    hit = true;
                    break;
                }
            }
            if (hit) {
                break;
            }
        }
        emit AttackMade(msg.sender, _x, _y, hit);
        return hit;
    }
}
