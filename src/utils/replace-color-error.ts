const messages = {
  PARAMETER_INVALID: "Parameter is not valid",
  PARAMETER_REQUIRED: "Parameter is required",
};

class ReplaceColorError extends Error {
  public code: keyof typeof messages;
  public field: string;

  constructor(code: keyof typeof messages, field: string) {
    super(messages[code]);
    this.name = this.constructor.name;
    this.code = code;
    this.field = field;
  }
}

export default ReplaceColorError;
