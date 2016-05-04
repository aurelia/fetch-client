/**
* Create a Blob containing JSON-serialized data.
* Useful for easily creating JSON fetch request bodies.
*
* @param body The object to be serialized to JSON.
* @returns A Blob containing the JSON serialized body.
*/
export function json(body: any): Blob {
  return new Blob([JSON.stringify(body)], { type: 'application/json' });
}
