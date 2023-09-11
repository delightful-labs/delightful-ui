/** @typedef {typeof __propDef.props}  DetailsProps */
/** @typedef {typeof __propDef.events}  DetailsEvents */
/** @typedef {typeof __propDef.slots}  DetailsSlots */
export default class Details extends SvelteComponent<{
    title?: string | undefined;
    opened?: boolean | undefined;
    positionAbsolutely?: boolean | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    default: {};
}> {
}
export type DetailsProps = typeof __propDef.props;
export type DetailsEvents = typeof __propDef.events;
export type DetailsSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        title?: string | undefined;
        opened?: boolean | undefined;
        positionAbsolutely?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export {};
