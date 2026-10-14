import Button from './Components/Button.svelte'
import NumberKeypad from './Components/NumberKeypad.svelte'
import Details from './Components/Details.svelte'
import Dialog from './Components/Dialog.svelte'
import Popover from './Components/Popover.svelte'
import LoadingSpinner from './Components/LoadingSpinner.svelte'
import StatusMessage from './Components/StatusMessage.svelte'
import Table from './Components/Table.svelte'
import ScreenReaderText from './Components/ScreenReaderText.svelte'
import InputText from './Components/Inputs/InputText.svelte'
import FieldFeedback from './Components/Inputs/FieldFeedback.svelte'
import InputNumber from './Components/Inputs/InputNumber.svelte'
import Select from './Components/Inputs/Select.svelte'
import Textarea from './Components/Inputs/Textarea.svelte'
import Checkbox from './Components/Inputs/Checkbox.svelte'
import InputDate from './Components/Inputs/InputDate.svelte'
import TagInput from './Components/Inputs/TagInput.svelte'

export {
	Button,
	NumberKeypad,
	Details,
	Dialog,
	Popover,
	InputText,
	FieldFeedback,
	InputNumber,
	InputDate,
	TagInput,
	Select,
	Textarea,
	Checkbox,
	LoadingSpinner,
	StatusMessage,
	Table,
	ScreenReaderText
}

export const INPUT_TYPES = Object.freeze({
	EMAIL: 'email',
	NUMBER: 'number',
	SEARCH: 'search',
	TEL: 'tel',
	TEXT: 'text',
	URL: 'url'
})

/** @typedef {import('./Components/NumberKeypad.svelte').NumberKeypadKey} NumberKeypadKey */
