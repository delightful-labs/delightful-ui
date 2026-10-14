<script lang="ts">
	import Drawer from '#lib/Components/Drawer.svelte'
	let {
		initialOpen = false,
		initialMode = 'inline',
		longContent = false
	}: {
		initialOpen?: boolean
		initialMode?: 'inline' | 'overlay'
		longContent?: boolean
	} = $props()
	let open = $state((() => initialOpen)())
	let mode = $state<'inline' | 'overlay'>((() => initialMode)())
</script>

<button
	id="drawer-toggle"
	aria-controls="drawer-panel"
	aria-expanded={open}
	onclick={() => (open = !open)}>Toggle drawer</button
>
<label for="drawer-mode">Drawer mode</label>
<select id="drawer-mode" bind:value={mode}>
	<option value="inline">Inline</option>
	<option value="overlay">Overlay</option>
</select>
<div class="layout">
	<Drawer
		heading="Fixture menu"
		closeLabel="Close menu"
		id="drawer-panel"
		triggerId="drawer-toggle"
		{mode}
		bind:open
	>
		<div class="links">
			<a href="#accounts">Accounts</a>
			{#if longContent}
				{#each Array.from({ length: 40 }, (_, i) => i) as i (i)}
					<a href={`#section-${i}`}>Section {i}</a>
				{/each}
			{/if}
		</div>
	</Drawer>
	<button onclick={() => (open = false)}>Close externally</button>
</div>

<style>
	.layout {
		display: flex;
		gap: 1rem;
	}
	.links {
		display: grid;
		gap: 0.5rem;
	}
</style>
