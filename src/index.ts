/**
 * Type definition for tasks that can be executed with a time limit
 */
type Task<T> = (() => Promise<T>) | (() => T) | Promise<T> | Array<Promise<T>>;

/**
 * Executes a task with a maximum execution time limit.
 *
 * @template T - The return type of the task
 * @param {Task<T>} task - The task to execute. Can be a function, a promise, or an array of promises.
 * @param {number} maxExecutionTime - Maximum execution time in seconds.
 * @param {string} [failMessage=''] - Optional failure message to include in the error.
 * @returns {Promise<T>} - Resolves with task result or rejects on timeout.
 * @throws {Error} - Throws if the task exceeds the time limit or if an invalid task type is provided.
 *
 * @example
 * // With a function
 * await taskWithTimeLimit(async () => fetchData(), 5, 'Data fetch');
 *
 * @example
 * // With a promise
 * await taskWithTimeLimit(fetchData(), 5, 'Data fetch');
 *
 * @example
 * // With an array of promises
 * await taskWithTimeLimit([promise1, promise2], 5, 'Multiple operations');
 */
function taskWithTimeLimit<T>(
  task: Task<T>,
  maxExecutionTime: number,
  failMessage: string = ''
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        new Error(
          'Maximum execution time exceeded for function/promise: ' + failMessage
        )
      );
    }, maxExecutionTime * 1000);

    try {
      let taskResults: T;
      // If the task is a promise, await it
      if (task instanceof Promise) {
        taskResults = await task;
        console.log('is promise!');
      }
      // If the task is a function, execute and await it
      else if (typeof task === 'function') {
        taskResults = await task();
        console.log('is function, results:', taskResults);
      }
      // If the task is an array of promises, await all
      else if (Array.isArray(task) && task[0] instanceof Promise) {
        taskResults = (await Promise.all(task)) as T;
        console.log('is promise array!');
      } else {
        throw new Error(
          'Invalid task type. Must be a function, a promise, or an array of promises.'
        );
      }
      clearTimeout(timeout);
      resolve(taskResults);
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

// CommonJS export for backwards compatibility
export = { taskWithTimeLimit };

