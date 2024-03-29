/* [ Form Input Types ] */

export type AutocompleteOptions = 
  | 'off'
  | 'on'

export type InputTypes = 
| 'email' 
| 'number' 
| 'search'
| 'tel' 
| 'text' 
| 'url';

export type InputModes = 
  | 'none'
  | 'text'
  | 'tel'
  | 'url'
  | 'email'
  | 'numeric'
  | 'decimal'
  | 'search'
  | undefined;

export type LocalizedString = { [key: string]: string }

export type LocalizedStrings =  { [key: string]: LocalizedString }
