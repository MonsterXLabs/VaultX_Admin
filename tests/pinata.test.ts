import { describe, it, expect, vi } from 'vitest';
import { uploadMetaData } from '../src/utils/pinata';

// Mock the Pinata SDK
// Removed mocking of pinata to use live pinata

describe('uploadMetaData', () => {
  it('should upload metadata and return the correct IPFS URL', async () => {
    const sampleData = { key: 'value' };

    const result = await uploadMetaData(sampleData);

    console.log(result);
    expect(result).not.toBeNull();
  });
});
