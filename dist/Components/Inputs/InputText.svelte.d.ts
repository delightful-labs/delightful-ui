/** @typedef {typeof __propDef.props}  InputTextProps */
/** @typedef {typeof __propDef.events}  InputTextEvents */
/** @typedef {typeof __propDef.slots}  InputTextSlots */
export default class InputText extends SvelteComponent<{
    style?: string | undefined;
    title?: string | undefined;
    required?: boolean | undefined;
    key?: string | undefined;
    inputmode?: import("../../types").InputModes;
    maxlength?: number | undefined;
    minlength?: number | undefined;
    pattern?: string | undefined;
    value?: string | undefined;
    list?: string[] | undefined;
    size?: number | undefined;
    placeholder?: string | undefined;
    limitToNumbers?: boolean | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type InputTextProps = typeof __propDef.props;
export type InputTextEvents = typeof __propDef.events;
export type InputTextSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        style?: string | undefined;
        title?: string | undefined;
        required?: boolean | undefined;
        key?: string | undefined;
        inputmode?: import('../../types').InputModes;
        maxlength?: number | undefined;
        minlength?: number | undefined;
        pattern?: string | undefined;
        value?: string | undefined;
        list?: string[] | undefined;
        size?: number | undefined;
        placeholder?: string | undefined;
        limitToNumbers?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
