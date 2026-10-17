import Button from './Components/Button.svelte'
import Icon from './Components/Icon.svelte'
import NumberKeypad from './Components/NumberKeypad.svelte'
import Details from './Components/Details.svelte'
import Dialog from './Components/Dialog.svelte'
import Popover from './Components/Popover.svelte'
import LoadingSpinner from './Components/LoadingSpinner.svelte'
import StatusMessage from './Components/StatusMessage.svelte'
import LoadingScreen from './Components/LoadingScreen.svelte'
import Table from './Components/Table.svelte'
import Navigation from './Components/Navigation.svelte'
import Stepper from './Components/Stepper.svelte'
import TopNavigation from './Components/TopNavigation.svelte'
import Drawer from './Components/Drawer.svelte'
import ScreenReaderText from './Components/ScreenReaderText.svelte'
import InputText from './Components/Inputs/InputText.svelte'
import FieldFeedback from './Components/Inputs/FieldFeedback.svelte'
import InputNumber from './Components/Inputs/InputNumber.svelte'
import InputCurrency from './Components/Inputs/InputCurrency.svelte'
import Select from './Components/Inputs/Select.svelte'
import Textarea from './Components/Inputs/Textarea.svelte'
import Checkbox from './Components/Inputs/Checkbox.svelte'
import InputAvatar from './Components/Inputs/InputAvatar.svelte'
import InputImage from './Components/Inputs/InputImage.svelte'
import InputDate from './Components/Inputs/InputDate.svelte'
import TagInput from './Components/Inputs/TagInput.svelte'

export {
	Button,
	Icon,
	NumberKeypad,
	Details,
	Dialog,
	Popover,
	InputText,
	FieldFeedback,
	InputNumber,
	InputCurrency,
	InputDate,
	InputImage,
	InputAvatar,
	TagInput,
	Select,
	Textarea,
	Checkbox,
	LoadingSpinner,
	StatusMessage,
	LoadingScreen,
	Table,
	Navigation,
	Stepper,
	TopNavigation,
	Drawer,
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
