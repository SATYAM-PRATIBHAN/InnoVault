export async function retry<T>(operation: () => Promise<T>, retries: number = 10, delay: number = 1000): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
      try {
          return await operation(); // Attempt the operation
      } catch (error) {
          console.log(`Attempt ${attempt} failed:`, error);
          if (attempt < retries) {
              await new Promise(res => setTimeout(res, delay)); // Wait before retrying
          } else {
              throw error; // Throw error after all attempts fail
          }
      }
  }
  throw new Error("Unexpected error in retry logic");
}
