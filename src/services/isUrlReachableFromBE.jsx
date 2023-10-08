export async function isUrlReachableFromBE(inputUrl) {
  let urlParts = new URL(inputUrl)
  let url = 'https://cors-anywhere.paul161.repl.co/' + urlParts.host + urlParts.pathname
  //NOTE: only trying to get headers not whole page.
  let response = await fetch(url, { method: 'HEAD' })
    .catch(async e => {
      console.log('There has been a problem with your fetch operation: ')
      return (e);
    });
  return response
}
