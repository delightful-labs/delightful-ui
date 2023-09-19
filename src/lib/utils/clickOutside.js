//@TODO: fix types.
//This article can help: https://stackoverflow.com/questions/64131176/svelte-custom-event-on-svelte-typescript

/**
 * 
 * @param {HTMLDetailsElement} node
 */
export default function clickOutside(node) {

  /**
   * @param {MouseEvent & { target: HTMLDetailsElement }} event 
   */
  const handleClick = (event) => {
    const target = event.target
    
    if (target && !node.contains(event.target)) {
      node.dispatchEvent(new CustomEvent("clickoutside"))
    }
  }

  document.addEventListener("click", handleClick, true)

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true)
    }
  }
}