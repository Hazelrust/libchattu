import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getEBSCOTokens } from '../../src/services/auth';

// Mock = จำลอง API ภายนอก
describe('getEBSCOTokens', () => {
  // Mock env (KV store)
  const mockEnv = {
    KV: {
      get: vi.fn() // vi.fn() = fake function
    }
  };
  
  // Mock fetch
  global.fetch = vi.fn();
  
  beforeEach(() => {
    // Reset ก่อน test แต่ละอัน
    vi.clearAllMocks();
  });
  
  it('should get tokens successfully', async () => {
    // 1. Setup - จำลองค่าที่จะได้
    mockEnv.KV.get
      .mockResolvedValueOnce('testuser')     // EBSCO_USER
      .mockResolvedValueOnce('testpass')     // EBSCO_PASS  
      .mockResolvedValueOnce('testprofile'); // EBSCO_PROFILE
    
    // จำลอง API response
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ AuthToken: 'auth-123' })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ SessionToken: 'session-456' })
      });
    
    // 2. Act - เรียกใช้งาน
    const tokens = await getEBSCOTokens(mockEnv);
    
    // 3. Assert - ตรวจสอบ
    expect(tokens).toEqual({
      authToken: 'auth-123',
      sessionToken: 'session-456'
    });
    
    // ตรวจสอบว่าเรียก API ถูกต้อง
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith(
      'https://eds-api.ebscohost.com/Authservice/rest/UIDAuth',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          UserId: 'testuser',
          Password: 'testpass'
        })
      })
    );
  });
  
  it('should throw error when credentials missing', async () => {
    // Setup - ไม่มี credentials
    mockEnv.KV.get.mockResolvedValue(null);
    
    // ตรวจสอบว่า throw error
    await expect(getEBSCOTokens(mockEnv)).rejects.toThrow('Missing EBSCO credentials');
  });
});
