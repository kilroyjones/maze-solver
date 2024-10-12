<script lang="ts">
  import { mazeStore } from "$lib/stores/maze.store";
  import { onMount } from "svelte";

  let width = 15;
  let height = 15;

  const numbers: Array<number> = Array.from({ length: 21 }, (_, i) => 7 + i * 4);

  function handleRun() {
    mazeStore.setDimensions(width, height);
    mazeStore.generateMaze();
  }

  onMount(() => {
    mazeStore.setDimensions(width, height);
    mazeStore.generateMaze();
  });
</script>

<div class="flex items-center justify-center p-4">
  <div class="join">
    <select class="select select-bordered join-item" bind:value={width}>
      {#each numbers as num}
        <option value={num}>{num}</option>
      {/each}
    </select>
    <select class="select select-bordered join-item" bind:value={height}>
      {#each numbers as num}
        <option value={num}>{num}</option>
      {/each}
    </select>
    <button class="bg-gray-300 btn join-item" on:click={handleRun}> Generate </button>
  </div>
</div>
