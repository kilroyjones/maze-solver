import { writable } from "svelte/store";
import { Maze } from "$lib/maze/maze";
import { MazeGenerator } from "$lib/maze/generator";
import { MazeSolver, MazeSolverAlgorithms } from "$lib/maze/solver";

import type { Coordinate } from "$lib/maze/maze";

interface MazeState {
  width: number;
  height: number;
  maze?: Maze;
  solution?: Coordinate[];
}

function createMazeStore() {
  const { subscribe, set, update } = writable<MazeState>({
    width: 29,
    height: 29,
    maze: undefined,
    solution: undefined,
  });

  return {
    subscribe,
    generateMaze: () =>
      update(state => {
        const mazeGenerator = new MazeGenerator(state.width, state.height);
        const maze: Maze = mazeGenerator.generate();

        return {
          ...state,
          maze: maze,
          solution: undefined,
        };
      }),
    solveMaze: () =>
      update(state => {
        if (state.maze) {
          const mazeSolver = new MazeSolver(state.maze);
          const solution = mazeSolver.solve(MazeSolverAlgorithms.ASTAR);
          if (solution) {
            return { ...state, solution };
          }
          return { ...state };
        }
        return state;
      }),
    setDimensions: (width: number, height: number) =>
      update(state => ({
        ...state,
        width,
        height,
        maze: undefined,
        solution: undefined,
      })),
  };
}

export const mazeStore = createMazeStore();
