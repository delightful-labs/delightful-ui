import type { Snippet } from 'svelte'
import type { HTMLInputAttributes } from 'svelte/elements'

export type ImageInputProps = Omit<
	HTMLInputAttributes,
	| 'multiple'
	| 'type'
	| 'value'
	| 'files'
	| 'defaultValue'
	| 'defaultvalue'
	| 'children'
	| 'readonly'
> & {
	imageActions?: Snippet<[File, string]>
	label: string
	uploadLabel?: string
	removeLabel?: string
	infoLabel?: string
	shape?: 'square' | 'circle'
	imageState?: (file: File) => {
		status: 'ready' | 'uploading' | 'error'
		label?: string
	}
}
