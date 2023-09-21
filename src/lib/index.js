import Button from "./Components/Button.svelte"
import Details from "./Components/Details.svelte"
import Dialog from "./Components/Dialog.svelte"
import LoadingSpinner from "./Components/LoadingSpinner.svelte"
import ScreenReaderText from "./Components/ScreenReaderText.svelte"
import InputText from "./Components/Inputs/InputText.svelte"
import InputNumber from "./Components/Inputs/InputNumber.svelte"

export { 
  Button, 
  Details, 
  Dialog,
  InputText, 
  InputNumber, 
  LoadingSpinner, 
  ScreenReaderText 
}

export const INPUT_TYPES = Object.freeze({ 
  EMAIL: "email", 
  NUMBER: "number",
  SEARCH: "search", 
  TEL: "tel",
  TEXT: "text", 
  URL: "url" 
})

export const DEFAULT_LANGUAGE = 'EN'

/**
 * @typedef {import('$lib/types').LocalizedString} LocalizedString
 * @type {{ [key: string]: LocalizedString}}
 */
export const DEFAULT_LABELS = {
  BUTTON: {
    EN: 'click me'
  },
  DIALOGUE: {
    EN: 'Title'
  }
}
