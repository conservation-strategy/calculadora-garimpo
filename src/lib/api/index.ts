export async function fetchWithRetries(
  url: string,
  options?: RequestInit,
  retries = 3, 
  baseDelay = 1000
) {
  const nonRetryableStatuses = [401, 403, 404];
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      if (nonRetryableStatuses.includes(response.status)) {
        return response;
      }
    } catch (error: any) {
      // Check if error is non-retryable (like CORS)
      if (error instanceof TypeError || i === retries - 1) {
        throw error;
      }
      console.error(`Fetch attempt ${i + 1} failed with error:`, error.message);
    }

    // Consolidated delay logic - only execute if we're going to retry
    if (i < retries - 1) {
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error(`Failed to fetch after ${retries} retries`);
}