// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

contract Battleship {
    
    struct Player {
        string name;
        bool joined;
        uint8 shipsPlaced;
        address playerAddress;
    }

    struct Ship {
        uint8 x;
        uint8 y;
        uint8 length;
        bool horizontal;
    }

    mapping(address => Ship[]) public playerShipsMap;

    address[] public playerAddresses;
    mapping(address => Player) public players;

    event PlayerJoined(address player, string name);
    event ShipAdded(address player, uint8 x, uint8 y, uint8 length, bool horizontal);
    event GameStarted();

    constructor() {}

    function joinGame(string memory _name) public {
        require(playerAddresses.length < 2, "Game is full");
        require(!players[msg.sender].joined, "Player already joined the game");
        players[msg.sender] = Player(_name, true, 0, msg.sender);
        playerAddresses.push(msg.sender);
        emit PlayerJoined(msg.sender, _name);
    }

    function startGame() public {
        require(playerAddresses.length == 2, "Not enough players");
        emit GameStarted();
    }

    function addShip(uint8 _length, uint8 _x, uint8 _y, bool _horizontal) public {
        require(players[msg.sender].joined, "Player not joined the game");
        require(players[msg.sender].shipsPlaced < 5, "Player has already placed 5 ships");
        require(_x < 10, "Ship placed outside grid horizontally");
        require(_y < 10, "Ship placed outside grid vertically");
        require(_length > 0, "Ship length cannot be less than 1");
        require(_length < 6, "Ship length cannot be greater than 5");
        require(_horizontal == true || _horizontal == false, "Horizontal orientation must be true or false");
        if (_horizontal == true) {
            require(_x + _length < 10, "Ship goes beyond grid horizontally");
        } else {
            require(_y + _length < 10, "Ship goes beyond grid vertically");
        }
        Ship memory newShip = Ship(_x, _y, _length, _horizontal);
        playerShipsMap[msg.sender].push(newShip);
        players[msg.sender].shipsPlaced++;
        emit ShipAdded(msg.sender, _x, _y, _length, _horizontal);
    }

    function getShips(address _player) public view returns (Ship[] memory) {
        return playerShipsMap[_player];
    }

    function getPlayers() public view returns (Player[] memory) {
        Player[] memory result = new Player[](playerAddresses.length);
        for (uint i = 0; i < playerAddresses.length; i++) {
            result[i] = players[playerAddresses[i]];
        }
        return result;
    }

}
