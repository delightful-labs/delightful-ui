<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Text from '$components/Inputs/Text.svelte'

</script>

<Meta title="Inputs/Text" component={Text}/>

<Template let:args>
  <Text {...args} />
</Template>

<Story name="Text Input" args={{type: "text"}}/>
