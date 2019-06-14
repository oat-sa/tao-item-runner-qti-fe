# tao-item-runner-qti-fe

QTI Item Runner frontend library of TAO.

Available scripts in the project:

- `HOST=<host> PORT=<port> npm run test <testname>`: run test suite
  - `HOST` (optional environment variable, default: 127.0.0.1): Test server listen host
  - `PORT` (optional environment variable, default: 8082): Test server listen port
  - `testname` (optional): Specific test to run. If it is not provided, all will be ran.
- `HOST=<host> PORT=<port> npm run test:keepAlive`: start test server
  - `HOST` (optional environment variable, default: 127.0.0.1): Test server listen host
  - `PORT` (optional environment variable, default: 8082): Test server listen port
- `npm run build`: build for production into `dist` directory
- `npm run buildScss`: find all scss files in `scss` directory and compile them into `css` directory
- `npm run lint`: check syntax of code
- `npm run prepare`: runs `buildScss` and `build` scripts
