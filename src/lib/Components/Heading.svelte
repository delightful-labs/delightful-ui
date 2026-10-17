<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAttributes } from 'svelte/elements'

	type Level = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
	type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
	type Props = Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> & {
		level?: Level
		size?: Size
		align?: 'start' | 'center' | 'end' | 'left' | 'right' | 'justify'
		children: Snippet
	}

	let { level = 'h2', size, align, children, ...attributes }: Props = $props()
	const sizes: Record<Level, Size> = {
		h1: 'xxl',
		h2: 'xl',
		h3: 'lg',
		h4: 'md',
		h5: 'sm',
		h6: 'xs'
	}
	const resolvedSize = $derived(size ?? sizes[level])
</script>

<svelte:element
	this={level}
	{...attributes}
	data-size={resolvedSize}
	data-align={align}
>
	{@render children()}
</svelte:element>

<style>
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin: 0;
		font-family: var(
			--dui-heading-font-family,
			var(--dui-font-family, inherit)
		);
		font-weight: var(--dui-heading-font-weight, 600);
		line-height: var(--dui-heading-line-height, 1.3);
		color: var(--dui-heading-color, var(--dui-color-foreground, inherit));
		overflow-wrap: anywhere;
	}

	[data-size='xs'] {
		font-size: var(--dui-heading-font-size, var(--dui-font-size-xs, 0.75rem));
	}

	[data-size='sm'] {
		font-size: var(--dui-heading-font-size, var(--dui-font-size-sm, 0.875rem));
	}

	[data-size='md'] {
		font-size: var(--dui-heading-font-size, var(--dui-font-size-md, 1rem));
	}

	[data-size='lg'] {
		font-size: var(--dui-heading-font-size, var(--dui-font-size-lg, 1.125rem));
	}

	[data-size='xl'] {
		font-size: var(--dui-heading-font-size, var(--dui-font-size-xl, 1.25rem));
	}

	[data-size='xxl'] {
		font-size: var(--dui-heading-font-size, var(--dui-font-size-xxl, 1.5rem));
	}

	[data-align='start'] {
		text-align: start;
	}
	[data-align='center'] {
		text-align: center;
	}
	[data-align='end'] {
		text-align: end;
	}
	[data-align='left'] {
		text-align: left;
	}
	[data-align='right'] {
		text-align: right;
	}
	[data-align='justify'] {
		text-align: justify;
	}
</style>
