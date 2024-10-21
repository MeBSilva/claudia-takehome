export class ApplicationError extends Error {
  constructor(msg: string) {
    super(msg);
    // Set the prototype explicitly.
    // Utilizing new.target.prototype guarantees that subclasses of this one correctly set the prototype as well
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
