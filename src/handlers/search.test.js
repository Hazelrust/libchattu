import { describe, it, expect, vi } from 'vitest';
import { handleSearch } from '../../src/handlers/search';

// Mock service
vi.mock('../../src/services/auth', () => ({
  getEBSCOTokens: vi.fn().mockResolvedValue({
    authToken: 'test-auth',
    sessionToken: 'test-session'
  })
}));

describe('handleSearch', () => {
  // Mock fetch สำหรับ EBSCO API
  global.fetch = vi.fn();
  
  it('should search successfully', async () => {
    // 1. Setup request
    const request = new Request('https://example.com/search?q=javascript');
    const mockEnv = { KV: {} };
    
    // Mock EBSCO response
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => '<results>Found 10 books</results>'
    });
    
    // 2. เรียกใช้ handler
    const response = await handleSearch(request, mockEnv);
    
    // 3. ตรวจสอบ
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/xml');
    
    const responseText = await response.text();
    expect(responseText).toBe('<results>Found 10 books</results>');
  });
  
  it('should return error when query missing', async () => {
    // Request ไม่มี query
    const request = new Request('https://example.com/search');
    const mockEnv = { KV: {} };
    
    const response = await handleSearch(request, mockEnv);
    
    expect(response.status).toBe(400);
    const text = await response.text();
    expect(text).toBe('<error>Missing query parameter "q"</error>');
  });
});