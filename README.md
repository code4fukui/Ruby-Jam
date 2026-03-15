# Ruby-Jam

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

Ruby-Jam is a JavaScript-based Ruby interpreter that can be embedded into web applications.

## Features

- Asynchronous execution of Ruby code
- Support for basic Ruby syntax and constructs, including variables, functions, loops, and conditional statements
- Ability to pass in functions from the JavaScript environment to be called from Ruby code
- Includes unit tests to verify the interpreter's behavior

## Requirements

- JavaScript runtime, such as a modern web browser or Node.js

## Usage

The `execRuby` function is the main entry point for executing Ruby code. It takes the following parameters:

- `src`: The Ruby code to be executed, as a string.
- `opts` (optional):
  - `funcs`: An object containing JavaScript functions that can be called from the Ruby code.
  - `abortctrl`: An `AbortController` instance to allow interrupting the execution.
  - `output`: A function to handle output from the Ruby code (e.g., `console.log`).
  - `debug`: A boolean flag to enable debugging output.

Example usage:

```javascript
import { execRuby } from "./execRuby.js";

const funcs = {
  myFunction: (arg) => console.log(`Called with argument: ${arg}`),
};

const output = (s) => console.log(s);

const result = await execRuby(`
  myFunction("hello")
  puts "Ruby code executed successfully!"
`, { funcs, output });
```

## License

This project is licensed under the [MIT License](LICENSE).