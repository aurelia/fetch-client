/**
* Create a Blob containing JSON-serialized data.
* Useful for easily creating JSON fetch request bodies.
*
* @param {*} body - [description]
* @return {Blob} - A blob containing the JSON-serialized body.
*/
export function json(body) {
  return new Blob([JSON.stringify(body)], { type: 'application/json' });
}

/**
* Merges two Headers collections to create a third Headers object.
*
* @param {Headers|Object} first - The first Headers object, or an
* object whose key/value pairs correspond to header names and values.
* @param {Headers|Object} second - The second Headers object, or an
* object whose key/value pairs correspond to header names and values.
* Headers in the second collection will take priority.
* @return {Headers} - A Headers instance containing the headers from
* both objects.
*/
export function mergeHeaders(first, second) {
  let headers = new Headers(first || {});
  (new Headers(second || {})).forEach((value, name) => {
    headers.set(name, value);
  });

  return headers;
}
