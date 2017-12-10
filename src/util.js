/**
* Create a Blob containing JSON-serialized data.
* Useful for easily creating JSON fetch request bodies.
*
* @param body The object to be serialized to JSON.
* @param replacer The JSON.stringify replacer used when serializing.
* @returns A Blob containing the JSON serialized body.
*/
export function json(body: any, replacer?: any): Blob {
  return new Blob([JSON.stringify((body !== undefined ? body : {}), replacer)], { type: 'application/json' });
}
