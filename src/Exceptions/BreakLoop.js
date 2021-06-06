export default class BreakLoop extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
};