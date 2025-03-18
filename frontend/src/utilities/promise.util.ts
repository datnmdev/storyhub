class PromiseUtils {
  static async sleep(milisecond: number) {
    return new Promise((resolve) => {
      const timeOutId = setTimeout(() => {
        clearTimeout(timeOutId);
        resolve(null);
      }, milisecond);
    });
  }

  static async wait(callback: () => boolean) {
    return await new Promise((resolve) => {
      const intervalId = setInterval(() => {
        const result = callback();
        if (result) {
          clearInterval(intervalId);
          resolve(result);
        }
      }, 100);
    });
  }
}

export default PromiseUtils;
