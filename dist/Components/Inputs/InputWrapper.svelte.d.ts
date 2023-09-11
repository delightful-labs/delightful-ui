/** @typedef {typeof __propDef.props}  InputWrapperProps */
/** @typedef {typeof __propDef.events}  InputWrapperEvents */
/** @typedef {typeof __propDef.slots}  InputWrapperSlots */
export default class InputWrapper extends SvelteComponent<{
    title: string;
    key: string;
    required?: boolean | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    default: {};
}> {
}
export type InputWrapperProps = typeof __propDef.props;
export type InputWrapperEvents = typeof __propDef.events;
export type InputWrapperSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        title: string;
        key: string;
        required?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export {};
