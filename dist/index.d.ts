export const INPUT_TYPES: Readonly<{
    EMAIL: "email";
    NUMBER: "number";
    SEARCH: "search";
    TEL: "tel";
    TEXT: "text";
    URL: "url";
}>;
import Button from "./Components/Button.svelte";
import Details from "./Components/Details.svelte";
import LoadingSpinner from "./Components/LoadingSpinner.svelte";
import ScreenReaderText from "./Components/ScreenReaderText.svelte";
import InputText from "./Components/Inputs/InputText.svelte";
import InputNumber from "./Components/Inputs/InputNumber.svelte";
export { Button, Details, LoadingSpinner, ScreenReaderText, InputText, InputNumber };
