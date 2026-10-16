<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { SVGAttributes } from 'svelte/elements'

	type Props = SVGAttributes<SVGSVGElement> & {
		title?: string
		label?: string
		decorative?: boolean
		children?: Snippet
	}

	let {
		label,
		decorative = true,
		children,
		'aria-hidden': ariaHidden,
		'aria-labelledby': ariaLabelledby,
		role,
		title,
		...attributes
	}: Props = $props()

	let isDecorative = $derived(
		decorative && !label && !ariaLabelledby && !title && ariaHidden !== 'false'
	)
</script>

<svg
	{...attributes}
	role={isDecorative ? undefined : (role ?? 'img')}
	aria-hidden={isDecorative ? 'true' : ariaHidden}
	aria-label={label}
	aria-labelledby={ariaLabelledby}
	focusable="false"
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	stroke-linecap="round"
	stroke-linejoin="round"
	viewBox="0 0 24 24"
>
	{#if title && !isDecorative}
		<title>{title}</title>
	{/if}
	{@render children?.()}
</svg>
