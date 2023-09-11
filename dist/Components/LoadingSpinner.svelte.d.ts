/** @typedef {typeof __propDef.props}  LoadingSpinnerProps */
/** @typedef {typeof __propDef.events}  LoadingSpinnerEvents */
/** @typedef {typeof __propDef.slots}  LoadingSpinnerSlots */
export default class LoadingSpinner extends SvelteComponent<{
    text?: string | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type LoadingSpinnerProps = typeof __propDef.props;
export type LoadingSpinnerEvents = typeof __propDef.events;
export type LoadingSpinnerSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        text?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
