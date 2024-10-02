/**
 * Executes a task with a maximum execution time limit.
 *
 * @param {Function|Promise|Array<Promise>} task - The task to execute.
 * @param {number} maxExecutionTime - Maximum execution time in seconds.
 * @param {string} [failMessage=''] - Optional failure message.
 * @returns {Promise<any>} - Resolves with task result or rejects on timeout.
 */
function taskWithTimeLimit(task, maxExecutionTime, failMessage = '') {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Maximum execution time exceeded for function/promise: ' + failMessage));
    }, maxExecutionTime * 1000);

    try {
      let taskResults;
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
        taskResults = await Promise.all(task);
        console.log('is promise array!');
      } else {
        throw new Error('Invalid task type. Must be a function, a promise, or an array of promises.');
      }
      clearTimeout(timeout);
      resolve(taskResults);
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

module.exports = { taskWithTimeLimit };
