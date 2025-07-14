import { describe, it, expect } from 'vitest';
import { createXMLResponse } from '../../src/utils/responses';

// describe = กลุ่มของ test
describe('createXMLResponse', () => {
  // it = test แต่ละอัน
  it('should create XML response with correct headers', () => {
    // 1. เรียกใช้ function
    const response = createXMLResponse('<data>test</data>');
    
    // 2. ตรวจสอบผลลัพธ์
    expect(response.headers.get('Content-Type')).toBe('application/xml');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });
  
  it('should set custom status code', () => {
    const response = createXMLResponse('<error>Not found</error>', 404);
    expect(response.status).toBe(404);
  });
});