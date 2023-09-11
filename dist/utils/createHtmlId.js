/**
 * 
 * @param {string} value 
 * @returns 
 */
const createHtmlId = (value) => value.replace(/\W/g, '_').toLowerCase()

export default createHtmlId