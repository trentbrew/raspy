class Calculator {
  constructor() {
    this.memory = 0;
    this.lastResult = 0;
  }

  add(a, b) {
    this.lastResult = Number(a) + Number(b);
    return this.lastResult;
  }

  subtract(a, b) {
    this.lastResult = Number(a) - Number(b);
    return this.lastResult;
  }

  multiply(a, b) {
    this.lastResult = Number(a) * Number(b);
    return this.lastResult;
  }

  divide(a, b) {
    if (Number(b) === 0) throw new Error("Division by zero");
    this.lastResult = Number(a) / Number(b);
    return this.lastResult;
  }

  // Memory operations
  memoryClear() {
    this.memory = 0;
  }

  memoryStore(value) {
    this.memory = Number(value);
  }

  memoryRecall() {
    return this.memory;
  }

  // Special operations for LLMs
  evaluateExpression(expression) {
    try {
      // Safely evaluate mathematical expressions
      const sanitized = expression.replace(/[^0-9+\-*/().]/g, "");
      this.lastResult = Function(`'use strict'; return (${sanitized})`)();
      return this.lastResult;
    } catch (error) {
      throw new Error("Invalid expression");
    }
  }

  getLastResult() {
    return this.lastResult;
  }
}

export default new Calculator();
