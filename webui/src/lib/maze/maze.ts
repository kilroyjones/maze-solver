export interface Coordinate {
  readonly x: number;
  readonly y: number;
}

/**
 * @class Maze
 * @classdesc Represents a 2D maze
 *
 * @description
 * Creates a 2D maze which of type number that stores the maze coordinates
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

export class Maze {
  private maze: number[][];
  private start: Coordinate;
  private end: Coordinate;

  /**
   * Constructor
   *
   * @param maze number[][]
   * @param start Coordinate
   * @param end Coordinate
   */
  private constructor(maze: number[][], start: Coordinate, end: Coordinate) {
    this.maze = maze;
    this.start = start;
    this.end = end;
  }

  /**
   * Creates new Maze object or throws error.
   *
   * @param board number[][] is our newly defined maze
   * @param start Coordinate
   * @param end Coordinate
   * @returns Maze
   */
  static create(board: number[][], start: Coordinate, end: Coordinate): Maze {
    const isPossibleStart: boolean = Maze.isValidCoordinate(board, start);
    const isPossibleEnd: boolean = Maze.isValidCoordinate(board, start);

    if (!isPossibleStart || !isPossibleEnd) {
      throw new Error("Invalid start or end coordinate");
    }

    return new Maze(board, start, end);
  }

  /**
   * Checks if a coordinate is on the board and passable.
   *
   * @param board number[][]
   * @param coord Coordinate
   * @returns boolean
   */
  private static isValidCoordinate(board: number[][], coord: Coordinate): boolean {
    return (
      coord.y >= 0 &&
      coord.y < board.length &&
      coord.x >= 0 &&
      coord.x < board[0].length &&
      board[coord.y][coord.x] === 0
    );
  }

  /**
   * Wrapper of isValidCoordinate to check if valid coordinate that is used
   * after the maze has been defined.
   *
   * @param coord Coordinate
   * @returns
   */
  isValidMove(coord: Coordinate): boolean {
    return Maze.isValidCoordinate(this.maze, coord);
  }

  /**
   * Start Coordinate getter
   * @returnCoordinate
   */
  getStart(): Coordinate {
    return this.start;
  }

  /**
   * End Coordinate getter
   * @returnCoordinate
   */
  getEnd(): Coordinate {
    return this.end;
  }

  /**
   * Maze array getter
   * @returnCoordinate
   */
  getMazeArray(): number[][] {
    return this.maze;
  }
}
