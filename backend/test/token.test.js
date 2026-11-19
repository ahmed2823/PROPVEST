import assert from 'node:assert/strict';
import test from 'node:test';
import { createAuthToken, verifyAuthToken } from '../src/auth/token.js';

test('auth token round-trips the user id and rejects a different secret', () => {
  const token = createAuthToken('user-123', 'test-secret-with-more-than-thirty-two-bytes');
  assert.equal(verifyAuthToken(token, 'test-secret-with-more-than-thirty-two-bytes'), 'user-123');
  assert.throws(() => verifyAuthToken(token, 'another-test-secret-with-more-than-thirty-two-bytes'));
});
