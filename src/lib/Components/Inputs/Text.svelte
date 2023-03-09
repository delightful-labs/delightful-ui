<script>
  /**
   * @type {'email'|'text'|'url'}
   */
  export let type = 'text'
</script>

<input type={type} />

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