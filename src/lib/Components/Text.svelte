<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAttributes } from 'svelte/elements'

	type Props = Omit<
		HTMLAttributes<HTMLParagraphElement | HTMLSpanElement>,
		'children'
	> & {
		as?: 'p' | 'span'
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
		align?: 'start' | 'center' | 'end' | 'left' | 'right' | 'justify'
		children: Snippet
	}

	let {
		as = 'p',
		size = 'md',
		align,
		children,
		...attributes
	}: Props = $props()
</script>

<svelte:element this={as} {...attributes} data-size={size} data-align={align}>
	{@render children()}
</svelte:element>

<style>
	p,
	span {
		margin: 0;
		font-family: var(
			--dui-text-font-family,
			var(--dui-font-family-body, inherit)
		);
		line-height: var(--dui-text-line-height, 1.5);
		color: var(--dui-text-color, var(--dui-color-foreground, inherit));
		overflow-wrap: anywhere;
	}

	[data-size='xs'] {
		font-size: var(--dui-text-font-size, var(--dui-font-size-xs, 0.75rem));
	}

	[data-size='sm'] {
		font-size: var(--dui-text-font-size, var(--dui-font-size-sm, 0.875rem));
	}

	[data-size='md'] {
		font-size: var(--dui-text-font-size, var(--dui-font-size-md, 1rem));
	}

	[data-size='lg'] {
		font-size: var(--dui-text-font-size, var(--dui-font-size-lg, 1.125rem));
	}

	[data-size='xl'] {
		font-size: var(--dui-text-font-size, var(--dui-font-size-xl, 1.25rem));
	}

	[data-size='xxl'] {
		font-size: var(--dui-text-font-size, var(--dui-font-size-xxl, 1.5rem));
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
