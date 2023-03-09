<script>

  /**
   * @type {'email'|'text'|'url'}
   */
  export let type = 'text'
</script>

<input type={type} />

<style>
  input {
    min-height: var(--input-min-height, 48px);
  }
</style>