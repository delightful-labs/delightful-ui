<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

  import Button from '../lib/Components/Button.svelte';

</script>

<Meta title="Inputs/Button" component={Button}/>

<Template let:args>
  <Button {...args} />
</Template>

<Story name="Text" args={{text: "true"}}/>
