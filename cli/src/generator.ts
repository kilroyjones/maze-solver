import { Maze } from "./maze";
import type { Coordinate } from "./maze";

// Directions used in function shuffleDirections
const directions: [number, number][] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

/**
 * @class MazeGenerator
 *
 * @classdesc Generates mazes use depth-first search. For a complete description
 * of the algorithm involved, see the README.
 *
 */
export class MazeGenerator {
  private width: number;
  private height: number;
  private mazeArray: number[][];

  /**
   * Constructor assigning width and height and our initial fill maze.
   *
   * @param width: number
   * @param height: number
   */
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.mazeArray = Array(height)
      .fill(null)
      .map(() => Array(width).fill(1));
  }

  /**
   * Entry for maze generation starting from a random coordinate.
   *
   * @returns Maze
   */
  public generate(): Maze {
    const startCell: Coordinate = {
      x: 1 + Math.floor(Math.random() * Math.floor((this.width - 1) / 2)) * 2,
      y: 1 + Math.floor(Math.random() * Math.floor((this.height - 1) / 2)) * 2,
    };

    this.recursiveBacktrack(startCell);

    const [start, end] = this.createStartAndEnd();
    return Maze.create(this.mazeArray, start, end);
  }

  /**
   * Performs a depth-first maze creation. See README for detailed explanation
   * of this algorithm.
   *
   * @param coord Coordinate
   */
  private recursiveBacktrack(coord: Coordinate): void {
    this.mazeArray[coord.y][coord.x] = 0;

    const directions = this.shuffleDirections();

    for (const [dx, dy] of directions) {
      const newX = coord.x + dx * 2;
      const newY = coord.y + dy * 2;

      if (this.isValidCoordinate(newX, newY) && this.mazeArray[newY][newX] === 1) {
        this.mazeArray[coord.y + dy][coord.x + dx] = 0;
        this.recursiveBacktrack({ x: newX, y: newY });
      }
    }
  }

  /**
   * Checks if cells is within the bounds of the maze.
   *
   * @param x: number
   * @param y: number
   * @returns boolean
   */
  private isValidCoordinate(x: number, y: number): boolean {
    return x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1;
  }

  /**
   * Simple shuffling algorithm to randomize directions taken by DFS
   *
   * @returns
   */
  private shuffleDirections(): [number, number][] {
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }
    return directions;
  }

  /**
   * Defines our start and end points of the maze.
   *
   * @description
   * We ensure the maze starts on two different sides and the set those points
   * to be passable.
   *
   * @returns [Coordinate, Coordinate]
   */
  private createStartAndEnd(): [Coordinate, Coordinate] {
    const sides = ["top", "right", "bottom", "left"];
    const [startSide, endSide] = sides.sort(() => Math.random() - 0.5).slice(0, 2);

    const start = this.createStartAndEndCoordinate(startSide);
    const end = this.createStartAndEndCoordinate(endSide);

    this.mazeArray[start.y][start.x] = 0;
    this.mazeArray[end.y][end.x] = 0;

    return [start, end];
  }

  /**
   * Ensures the coordinate selected for start or end is valid
   *
   * @description
   * We are always selecting points along the walls of the maze, but we can't
   * ensure that these aren't bordeded by impassable cells on all three sides.
   * To attempt to avoid that we randomly select points along that chosen side
   * and then keep choosing until we get a coordinate that works.
   *
   * @remarks
   * This is hacky, but should be almost all the time. An alternative would be
   * to check the wall for all valid spots and then choose one of those
   * randomly. In this case, that would probably take more time than this method.
   *
   * @param side: string
   * @returnsCoordinate
   */
  private createStartAndEndCoordinate(side: string): Coordinate {
    let coord: Coordinate;
    let isValid = false;
    let attempts = 0;
    const maxAttempts = 100; // Used in case there's no valid coordinate

    while (!isValid && attempts < maxAttempts) {
      coord = this.getRandomSizeCoordinate(side);
      isValid = this.isValidStartEndPoint(coord);
      attempts++;
    }

    if (!isValid) {
      throw new Error(`Failed to create usable maze`);
    }

    return coord!;
  }

  /**
   * Given a side, it will choose a random coordinate along a given side.
   *
   * @param side: string
   * @returnsCoordinate
   */
  private getRandomSizeCoordinate(side: string): Coordinate {
    switch (side) {
      case "top":
        return { x: 1 + Math.floor(Math.random() * (this.width - 2)), y: 0 };
      case "right":
        return { x: this.width - 1, y: 1 + Math.floor(Math.random() * (this.height - 2)) };
      case "bottom":
        return { x: 1 + Math.floor(Math.random() * (this.width - 2)), y: this.height - 1 };
      case "left":
        return { x: 0, y: 1 + Math.floor(Math.random() * (this.height - 2)) };
      default:
        throw new Error("Invalid side");
    }
  }

  /**
   * Given a coordinate, it checks if it's in the bounds of the map and is a 1,
   * since the generated map should be surrouneded by impassable spaces.
   *
   * @param coord Coordinate
   * @returns boolean
   */
  private isValidStartEndPoint(coord: Coordinate): boolean {
    const { x, y } = coord;
    let wallCount = 0;

    for (const [dx, dy] of directions) {
      const updatedCoord: Coordinate = { x: x + dx, y: y + dy };

      if (
        updatedCoord.x >= 0 &&
        updatedCoord.y >= 0 &&
        updatedCoord.y < this.height &&
        updatedCoord.x < this.width &&
        this.mazeArray[updatedCoord.y][updatedCoord.x] === 1
      ) {
        wallCount++;
      }
    }

    return wallCount <= 2;
  }
}
