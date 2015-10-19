export default function Immutable(object) {
  Object.freeze(object);
  Object.getOwnPropertyNames(object).forEach(prop => {
    if (object.hasOwnProperty(prop)
    && object[prop] !== null
    && (typeof object[prop] === 'object' || typeof object[prop] === 'function')
    && !Object.isFrozen(object[prop]))
      Immutable(object[prop]);
  });
  return object;
};
