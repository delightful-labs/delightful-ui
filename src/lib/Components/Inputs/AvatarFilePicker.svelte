<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import Icon from '../Icon.svelte'
	import AvatarTile from './AvatarTile.svelte'
	let {
		input = $bindable(),
		shape = 'square',
		uploadLabel,
		...attributes
	}: Omit<HTMLInputAttributes, 'type' | 'value' | 'files' | 'children'> & {
		input?: HTMLInputElement
		shape?: 'square' | 'circle'
		uploadLabel: string
	} = $props()
</script>

<AvatarTile {shape} picker>
	<input {...attributes} bind:this={input} type="file" />
	<Icon width="24" height="24"><path d="M12 5v14M5 12h14" /></Icon>
	<span>{uploadLabel}</span>
</AvatarTile>

<style>
	input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		z-index: 1;
		cursor: pointer;
	}
	input:disabled {
		cursor: not-allowed;
	}
	span {
		max-width: 80%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
