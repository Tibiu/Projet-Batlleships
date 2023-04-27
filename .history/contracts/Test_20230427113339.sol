// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Battleship {
    using Counters for Counters.Counter;

    uint8 constant GRID_SIZE = 10;
    uint8 constant NUM_BOATS = 5;
    uint8 constant NUM_SHOTS = GRID_SIZE * GRID_SIZE;

    enum Direction {
        HORIZONTAL,
        VERTICAL
    }

    enum Kind {
        CARRIER,
        BATTLESHIP,
        CRUISER,
        DESTROYER,
        SUBMARINE
    }

    struct Coord {
        uint8 row;
        uint8 col;
    }

    struct Boat {
        Direction direction;
        Coord topLeftCoord;
        Kind kind;
    }

    enum GameState {
        SETUP,
        PLAYER1_TURN,
        PLAYER2_TURN,
        GAME_OVER
    }

    struct Game {
        address player1;
        address player2;
        mapping(address => Boat[NUM_BOATS]) boats;
        mapping(address => mapping(uint8 => mapping(uint8 => bool))) playerToShots;
        GameState state;
        address turn;
        uint8 numShots;
    }

    Counters.Counter private _gameIds;

    mapping(uint256 => Game) private _games;

    mapping(Direction => int8) private _directionToRowDelta;
    mapping(Direction => int8) private _directionToColDelta;

    event GameCreated(uint256 indexed gameId, address indexed player1, address indexed player2);
    event BoatAdded(address indexed player, Direction direction, Coord topLeftCoord, Kind kind);
    event Shot(address indexed player, Coord coord, bool hit, Kind kind);
    event GameOver(address indexed winner, address indexed loser);

    constructor() {
        _directionToRowDelta[Direction.HORIZONTAL] = 0;
        _directionToRowDelta[Direction.VERTICAL] = 1;

        _directionToColDelta[Direction.HORIZONTAL] = 1;
        _directionToColDelta[Direction.VERTICAL] = 0;
    }

    function createGame(address player2) public {
        _gameIds.increment();
        uint256 gameId = _gameIds.current();
        Game storage game = _games[gameId];
        game.player1 = msg.sender;
        game.player2 = player2;
        game.state = GameState.SETUP;
        emit GameCreated(gameId, game.player1, game.player2);
    }

    function addBoat(Direction direction, Coord memory topLeftCoord, Kind kind) public {
        Game storage game = _games[_gameIds.current()];

        require(game.state == GameState.SETUP, "La partie a commencé");
        require(game.turn == address(0), "Le tour a déjà été déterminé");
        require(game.boats[msg.sender][uint8(kind)].topLeftCoord.row == 0, "Ce bateau a déjà été placé");

        require(topLeftCoord.row < GRID_SIZE, "Ligne invalide");
        require(topLeftCoord.col < GRID_SIZE, "Colonne invalide");

        uint8 size = getBoatSize(kind);
        require(topLeftCoord.row + (size - 1) * _directionToRowDelta[direction] < GRID_SIZE, "Bateau hors de la grille");
        require(topLeftCoord.col + (size - 1) * _directionToColDelta[direction] < GRID_SIZE, "Bateau hors de la grille");

    for (uint8 i = 0; i < size; i++) {
        Coord memory coord = Coord({
            row: _topLeftCoord.row + i * _directionToRowDelta[_direction],
            col: _topLeftCoord.col + i * _directionToColDelta[_direction]
        });

        require(_grid[coord.row][coord.col] == 0, "Bateau mal placé");

        _grid[coord.row][coord.col] = uint8(_kind);
    }

    emit BoatAdded(_direction, _topLeftCoord, _kind);
}