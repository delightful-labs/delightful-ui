/** @typedef {typeof __propDef.props}  InputNumberProps */
/** @typedef {typeof __propDef.events}  InputNumberEvents */
/** @typedef {typeof __propDef.slots}  InputNumberSlots */
export default class InputNumber extends SvelteComponent<{
    style?: string | undefined;
    title?: string | undefined;
    required?: boolean | undefined;
    key?: string | undefined;
    inputmode?: import("../../types").InputModes;
    maxlength?: number | undefined;
    value?: number | undefined;
    size?: number | undefined;
    placeholder?: string | undefined;
    hideArrows?: boolean | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type InputNumberProps = typeof __propDef.props;
export type InputNumberEvents = typeof __propDef.events;
export type InputNumberSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        style?: string | undefined;
        title?: string | undefined;
        required?: boolean | undefined;
        key?: string | undefined;
        inputmode?: import('../../types').InputModes;
        maxlength?: number | undefined;
        value?: number | undefined;
        size?: number | undefined;
        placeholder?: string | undefined;
        hideArrows?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
