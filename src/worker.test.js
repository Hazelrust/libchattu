import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { unstable_dev } from 'wrangler';

describe('Worker E2E Tests', () => {
  let worker;
  
  // Start worker ก่อน test
  beforeAll(async () => {
    worker = await unstable_dev('src/worker.js', {
      experimental: { disableExperimentalWarning: true }
    });
  });
  
  // Stop worker หลัง test
  afterAll(async () => {
    await worker.stop();
  });
  
  it('should handle /search endpoint', async () => {
    const response = await worker.fetch('/search?q=test');
    expect(response.status).toBe(500);
  });
  
  it('should return 404 for unknown routes', async () => {
    const response = await worker.fetch('/unknown');
    expect(response.status).toBe(404);
  });
});
