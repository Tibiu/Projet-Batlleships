// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract BattleShip {
    
    address public player1;
    address public player2;
    uint8[10][10] public player1Board;
    uint8[10][10] public player2Board;
    uint8 public currentPlayer;

    event GameStarted(address player1, address player2);
    event TurnTaken(address player, uint8 x, uint8 y, bool hit);
    event GameOver(address winner);

    constructor(address _player1, address _player2) {
        require(_player1 != _player2, "Players cannot be the same.");
        player1 = _player1;
        player2 = _player2;
        currentPlayer = 1;
        emit GameStarted(player1, player2);
    }

    function takeTurn(uint8 x, uint8 y) public {
        require(msg.sender == player1 || msg.sender == player2, "You are not a player in this game.");
        require(player1Board[x][y] == 0 && player2Board[x][y] == 0, "This position has already been hit.");
        require(currentPlayer == 1 && msg.sender == player1 || currentPlayer == 2 && msg.sender == player2, "It's not your turn.");

        bool hit = false;
        if (currentPlayer == 1) {
            player2Board[x][y] = hasShip(player2Board, x, y) ? 2 : 1;
            hit = player2Board[x][y] == 2;
        } else {
            player1Board[x][y] = hasShip(player1Board, x, y) ? 2 : 1;
            hit = player1Board[x][y] == 2;
        }

        emit TurnTaken(msg.sender, x, y, hit);

        if (isGameOver()) {
            emit GameOver(msg.sender);
        } else {
            currentPlayer = currentPlayer == 1 ? 2 : 1;
        }
    }

    function hasShip(uint8[10][10] memory board, uint8 x, uint8 y) internal pure returns (bool) {
        return board[x][y] == 2;
    }

    function isGameOver() public view returns (bool) {
        uint8[10][10] memory board = currentPlayer == 1 ? player2Board : player1Board;

        for (uint8 i = 0; i < 10; i++) {
            for (uint8 j = 0; j < 10; j++) {
                if (board[i][j] == 2) {
                    return false;
                }
            }
        }

        return true;
    }
}