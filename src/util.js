import {PLATFORM} from 'aurelia-pal';

/**
* Create a Blob if available or else an object containing JSON-serialized data.
* Useful for easily creating JSON fetch request bodies.
*
* @param body The object to be serialized to JSON.
* @returns A Blob, if available, or Object containing the JSON serialized body.
*/
export function json(body: any): Blob|Object {
  return PLATFORM.global.Blob
    ?  new PLATFORM.global.Blob([JSON.stringify(body)], { type: 'application/json' })
    : JSON.stringify(body);
}
