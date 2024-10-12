# Maze solver

A CLI and web-based implementation for a maze solver which makes use of depth-first search to generate the mazes and the A\* algorithm to solve them.

## Install (CLI)

To install the CLI tool clone the repo and move to the **cli** folder:

```bash
git clone https://github.com/kilroyjones/maze-solver
cd maze-solver/cli
```

Install the necessary packages using npm or your choice of package manager:

```bash
npm install
```

After that you should be good to go.

## Using the CLI

To run the program and define the size of an array to generate, you can do:

```bash
npm run go:dim 19,19
```

Ensure that there are no spaces between the number and commas.

Alternatively, you can directly run it by using:

```bash
npx ts-node src/index.ts --dim 19,19
```

You can also load a file from a maze. This file should contain a grid of 0s and 1s denoting passable and impassable, as well as a capital **S** and **E** for start and end, respectively. See **maps/example.txt** for an example map:

```bash
0S00000
0111000
0001100
0000100
0010000
1111001
0E00000
```

Solving this maze is done by the following:

```bash
npm run go:file maps/example.txt
```

Alternatively you can use:

```bash
npx ts-node src/index.ts --file maps/example.txt
```

## Install (webui)

To install the webui, clone the repo and move to the **webui** folder:

```bash
git clone https://github.com/kilroyjones/maze-solver
cd maze-solver/webui
```

Install the necessary packages using npm or your choice of package manager:

```bash
npm install
```

## Use the webui

You can run it in development mode by:

```bash
npm run dev
```

Then you can navigate to [http://localhost:5173](http://localhost:5173) or the indicated URL.

## Explanation of algorithms

### A\*

A\* works through the use of a priority queue which prioritizes nodes that have the lowest overall fScore. This fScore is calculated based on two components:

1. gScore: The current known length of the path to that point, found by adding 1 to the parent's gScore.
2. hScore: The estimated distance from the current coordinate to the end, measured by some heuristic (Manhattan distance in this case).

The fScore is the sum of gScore and hScore, representing our best guess at the total path length through this node.

The algorithm works, roughly, given these steps:

1. Start by adding the initial node to the queue.
2. Get the node with the lowest fScore from the queue.
3. If this node is the end node, we've found our path and can stop.
4. If not, get that node's neighbors.
5. For each neighbor:
   - Calculate its tentative gScore (parent's gScore + 1).
   - If this is better than any previously known gScore for this neighbor or the neighbor has yet to be visited:
     - Update the neighbor's gScore and fScore.
     - Set this node as the neighbor's parent.
     - Add the neighbor to the queue.
6. Repeat from step 2 until we've reached the end node or the queue is empty.

There is, of course, more nuance here, as we also need to track the current best path. In the code, this is done through the **parentMap** which connects each node to its best known parent, allowing us to work backwards to reconstruct the path once we've found the end.

This approach ensures that A* always explores the most promising nodes first, making it very efficient for pathfinding. The algorithm's performance heavily depends on the choice of heuristic - it must never overestimate the distance to the goal for A* to guarantee finding the optimal path.

### Depth-first search (DFS)

While there are many algorithms that can be used for generating mazes, such a [Prims](https://en.wikipedia.org/wiki/Prim%27s_algorithm), I chose DFS for its simplicity.

The DFS maze generation algorithm works by carving paths through a grid, starting from a random point and exploring as far as possible along each branch before backtracking. Here's how it operates:

1. Start with a grid filled with walls (represented by 1s in the code).

2. Choose a random starting cell on odd coordinate (odd values for x and y).

3. For the current cell:

   - Mark it as a path (represented by 0 in the code).
   - Get a list of potential directions to move (up, right, down, left).
   - Shuffle these directions to introduce randomness.

4. For each direction:

   - Check if moving two steps in this direction lands on a valid, unvisited cell.
   - If so:
     - Carve a path by setting the intermediate cell and the destination cell to 0.
     - Recursively apply the algorithm to the new cell.

5. If all directions are explored or invalid, the algorithm backtracks.

6. The process continues until all cells have been visited and the maze is fully generated.

This approach ensures that:

- Every cell in the maze is reachable, since it's essentially a tree (though a root system might be more apt).
- There are no loops.
- The maze is random due to the direction shuffling.

An important point is the notion of chosing **odd coordinate** (a coordinate with odd x,y values). We do this so when jumping two steps in another we leave space for walls. It's like we're cutting through an existing wall when we move two spaces.
