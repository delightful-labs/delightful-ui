import { DEFAULT_LABELS, DEFAULT_LANGUAGE } from '$lib'
import { getContext } from 'svelte'
import { writable } from 'svelte/store'

/**
 *
 * @param {string} label
 * @param {string} lang
 * @param {import('$lib/types').LocalizedString} [custom_label]
 * @param {import('$lib/types').LocalizedStrings} [custom_labels]
 * @returns {string}
 */
const process_copy = (label, lang, custom_label, custom_labels) => {
  if (custom_label?.[lang]) {
    return custom_label[lang]
  } else if (custom_labels?.[label]?.[lang]) {
    return custom_labels[label][lang]
  } else {
    return DEFAULT_LABELS[label][DEFAULT_LANGUAGE]
  }
}

export default class MicrocopyFactory {
  constructor() {
    this.preferred_language = getContext('preferred_language_store')
    this.custom_labels = getContext('custom_labels')
  }

  /**
   *
   * @param {string} label
   * @param {import('$lib/types').LocalizedString} [custom_label]
   * @returns {*}
   */
  display(label, custom_label) {
    const { set, subscribe, update } = writable('')

    if (this.preferred_language) {
      this.preferred_language.subscribe((/** @type {string} */ x) => set(process_copy(label, x, custom_label, this.custom_labels)))
    } else {
      set(process_copy(label, 'EN', custom_label, this.custom_labels))
    }
    
    return {
      set,
      subscribe,
      update
    }
  }
}