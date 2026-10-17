<script lang="ts">
	import { untrack } from 'svelte'
	import type { HTMLInputAttributes } from 'svelte/elements'
	import Button from '../Button.svelte'
	import Icon from '../Icon.svelte'
	import InputWrapper from './InputWrapper.svelte'

	type Props = Omit<
		HTMLInputAttributes,
		| 'type'
		| 'value'
		| 'files'
		| 'multiple'
		| 'defaultValue'
		| 'defaultvalue'
		| 'children'
		| 'readonly'
	> & {
		label: string
		uploadLabel?: string
		removeLabel?: string
		value?: File | null
	}

	const generatedId = $props.id()
	let {
		label,
		uploadLabel = 'Upload',
		removeLabel = 'Remove',
		id,
		value = $bindable(null),
		accept = 'image/*',
		disabled = false,
		oninput,
		onchange,
		...attributes
	}: Props = $props()
	const inputId = $derived(id ?? generatedId)
	let input = $state<HTMLInputElement>()
	let preview = $state<string>()
	let failedPreview = $state<string>()

	$effect(() => {
		const file = value
		if (!input) return
		const node = input
		untrack(() => {
			if ((node.files?.[0] ?? null) === file) return
			if (file) {
				const transfer = new DataTransfer()
				transfer.items.add(file)
				node.files = transfer.files
			} else node.value = ''
		})
	})

	$effect(() => {
		const url = value ? URL.createObjectURL(value) : undefined
		preview = url
		return () => {
			if (url) URL.revokeObjectURL(url)
		}
	})

	$effect(() => {
		// Track the explicit form attribute as well as the mounted input.
		attributes.form
		const form = input?.form
		function reset(event: Event) {
			queueMicrotask(() => {
				if (!event.defaultPrevented) value = null
			})
		}
		form?.addEventListener('reset', reset)
		return () => form?.removeEventListener('reset', reset)
	})

	function remove() {
		if (disabled || input?.matches(':disabled')) return
		value = null
		if (input) {
			input.value = ''
		}
	}
</script>

<InputWrapper title={label} key={inputId}>
	<div class="avatar">
		<div class="tile">
			<input
				{...attributes}
				bind:this={input}
				id={inputId}
				type="file"
				{accept}
				{disabled}
				oninput={(event) => {
					value = event.currentTarget.files?.[0] ?? null
					oninput?.(event)
				}}
				onchange={(event) => {
					value = event.currentTarget.files?.[0] ?? null
					onchange?.(event)
				}}
			/>
			{#if preview && failedPreview !== preview}
				<img
					src={preview}
					alt=""
					onerror={(event) => {
						failedPreview = event.currentTarget.getAttribute('src') ?? undefined
					}}
				/>
			{:else}
				<Icon width="24" height="24"><path d="M12 5v14M5 12h14" /></Icon>
			{/if}
		</div>
		<Button
			appearance="flat"
			{disabled}
			onclick={() => {
				if (input?.matches(':disabled')) return
				if (value) remove()
				else input?.click()
			}}>{value ? removeLabel : uploadLabel}</Button
		>
	</div>
</InputWrapper>

<style>
	.avatar {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--dui-avatar-gap, var(--dui-spacing-xs, 0.5rem));
		width: fit-content;
		min-width: min(var(--dui-avatar-size, 8rem), 100%);
		max-width: 100%;
	}

	.avatar :global(button) {
		min-width: min(var(--dui-avatar-size, 8rem), 100%);
		max-width: 100%;
		white-space: normal;
		overflow-wrap: anywhere;
	}

	.tile {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--dui-field-gap, var(--dui-spacing-xxs, 0.25rem));
		box-sizing: border-box;
		width: var(--dui-avatar-size, 8rem);
		max-width: 100%;
		aspect-ratio: 1;
		border: var(--dui-border-width, 2px) dashed
			var(--dui-input-border-color, var(--dui-color-foreground, currentColor));
		background: var(
			--dui-input-background-color,
			var(--dui-color-background, transparent)
		);
		color: var(--dui-input-color, var(--dui-color-foreground, inherit));
		font-family: var(--dui-input-font-family, var(--dui-font-family, inherit));
		font-size: var(--dui-input-font-size, var(--dui-font-size-md, 1rem));
	}

	.tile input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		z-index: 1;
		cursor: pointer;
	}

	.tile:has(input:not(:disabled)):hover {
		border-color: var(
			--dui-input-border-color-focus,
			var(--dui-color-accent, currentColor)
		);
	}

	.tile:has(input:focus-visible) {
		outline: 2px dashed
			var(--dui-input-focus-color, var(--dui-color-focus, #2563eb));
		outline-offset: 4px;
	}

	.tile:has(
		input:is([data-valid='false'], [aria-invalid='true'], :user-invalid)
	) {
		border-color: var(--dui-input-error-color, var(--dui-color-error, #b91c1c));
	}

	.tile:has(input:disabled) {
		opacity: var(--dui-input-disabled-opacity, 0.5);
	}

	.tile input:disabled {
		cursor: not-allowed;
	}

	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (forced-colors: active) {
		.tile:has(input:focus-visible) {
			outline-color: Highlight;
		}
	}
</style>
