import multer from "multer";

export default class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
