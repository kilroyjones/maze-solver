"use strict";
// maze.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maze = void 0;
/**
 * @class Maze
 * @classdesc Represents a 2D maze
 *
 * @description
 * Creates a 2D maze which of type number that stores the maze locations
 * denoting 0 as passable and 1 as not.
 *
 * @remarks
 * While this board could be more efficently stored using bytes or even a bits,
 * given that it's already in this format, it seems a waste to recreate it to
 * save memory. If we were planning to create and solve for larger mazes on
 * systems with memory constraints, then we could optimize using a Uint8Array.
 * We could go further and use BigInt to store the maze as bits and then use
 * bitwise operations if memory was a concern.
 *
 */
class Maze {
    /**
     * Constructor
     *
     * @param maze number[][]
     * @param startLocation
     * @param endLocation
     */
    constructor(maze, start, end) {
        this.maze = maze;
        this.start = start;
        this.end = end;
    }
    /**
     * Creates new Maze object or throws error.
     *
     * @param board number[][] is our newly defined maze
     * @param startLocation
     * @param endLocation
     * @returns Maze
     */
    static create(board, start, end) {
        const isPossibleStart = Maze.isValidCoordinate(board, start);
        const isPossibleEnd = Maze.isValidCoordinate(board, start);
        if (!isPossibleStart || !isPossibleEnd) {
            throw new Error("Invalid start or end coordinate");
        }
        return new Maze(board, start, end);
    }
    /**
     * Checks if a location is on the board and passable.
     *
     * @param board number[][]
     * @param coordLocation
     * @returns boolean
     */
    static isValidCoordinate(board, coord) {
        return (coord.y >= 0 &&
            coord.y < board.length &&
            coord.x >= 0 &&
            coord.x < board[0].length &&
            board[coord.y][coord.x] === 0);
    }
    /**
     * Wrapper of isValidCoordinate to check if valid coordinate that is used
     * after the maze has been defined.
     *
     * @param coord
     * @returns
     */
    isValidMove(coord) {
        return Maze.isValidCoordinate(this.maze, coord);
    }
    /**
     * Start Location getter
     * @returnLocation
     */
    getStart() {
        return this.start;
    }
    /**
     * End Location getter
     * @returnLocation
     */
    getEnd() {
        return this.end;
    }
    /**
     * Maze array getter
     * @returnLocation
     */
    getMazeArray() {
        return this.maze;
    }
    /**
     * Outputs the completed maze in a format like the following:
     *
     * S█***
     * *█*█*
     * ***█*
     * _███*
     * █___E
     *
     * Denoted with (S)tart, (E)nd, (*) path, (█) impassable and (_) as empty
     * spaces which have no been traversed.
     *
     * @param path ReadonlyArray<Location)
     * @returns string
     */
    formatPath(path) {
        const pathSet = new Set(path.map(coord => `${coord.x},${coord.y}`));
        let result = "";
        for (let y = 0; y < this.maze.length; y++) {
            for (let x = 0; x < this.maze[y].length; x++) {
                if (x === this.start.x && y === this.start.y) {
                    result += "S";
                }
                else if (x === this.end.x && y === this.end.y) {
                    result += "E";
                }
                else if (pathSet.has(`${x},${y}`)) {
                    result += "*";
                }
                else if (this.maze[y][x] === 0) {
                    result += "_";
                }
                else {
                    result += "█";
                }
            }
            result += "\n";
        }
        return result;
    }
}
exports.Maze = Maze;
