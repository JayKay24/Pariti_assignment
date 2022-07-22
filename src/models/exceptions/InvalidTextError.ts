class InvalidTextError extends Error {
  constructor(propertyName: string) {
    const defaultMessage = `${propertyName} length must not be less than 0`;
    super(defaultMessage);
  }
}

class InvalidName extends InvalidTextError {}

class InvalidDescription extends InvalidTextError {}

export { InvalidName, InvalidDescription };
