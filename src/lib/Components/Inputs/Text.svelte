<script>
  
  /** @enum {string} */
  const TextInputTypes = {
    Email: 'email',
    Search: 'search',
    Text: 'text',
    Url: 'url'
  };

  /**
   * @type {TextInputTypes}
   */
  export let type = 'text'

  /**
	 * @type {string}
	 */
  export let style = ''
</script>

<input {type} {style} />

<style>
  input {
    box-sizing: border-box;
    padding: var(--input-padding, 1rem);
    color: var(--input-color, inherit);
    min-height: var(--input-min-height, 48px);
    border-style: var(--input-border-style, solid);
    border-width: var(--input-border-width, 1px);
    background-color: var(--input-background-color, transparent);
  }
</style>