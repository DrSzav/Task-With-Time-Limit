# task-with-time-limit
Purpose:

A utility to execute tasks (functions or promises) with a maximum execution time limit. Throws an error if the task takes too long to execute.

This was created to for long running tasks running on AWS lambda, google cloud functions, etc Where you may want to limit the execution time and perform logging/cleanup etc before the lambda function is terminated by the runtime.

Lambda functions are terminated by the runtime after 15 minutes (or less) of execution time.
## Installation

```bash
npm install task-with-time-limit
```

## Usage

```javascript
import taskWithTimeLimit from 'task-with-time-limit';

const task = async () => {
  // Your task code here
};

const result = await taskWithTimeLimit(task, 5, '{put your error message here}');

// If the task takes more than 5 seconds, it will throw an error
// If the task is successful, it will return the result

// Example with a promise
const promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve('Task completed');
  }, 3000);
});

const result = await taskWithTimeLimit(promise, 5, 'Promise failed');

// If the promise takes more than 5 seconds, it will throw an error
// If the promise is successful, it will return the result

// Example with an array of promises
const promises = [
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('Promise 1 completed');
    }, 2000);
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('Promise 2 completed');
    }, 3000);
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('Promise 3 completed');
    }, 4000);
  }),
];

const results = await taskWithTimeLimit(promises, 5, 'Promises failed');

// If any of the promises take more than 5 seconds, it will throw an error
// If all promises are successful, it will return an array of results
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

