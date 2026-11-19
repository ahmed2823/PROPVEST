import test from 'node:test';
import assert from 'node:assert/strict';
import { signinSchema, signupSchema } from '../src/auth/validation.js';

test('signup trims the name and normalizes the email address', () => {
  const result = signupSchema.parse({
    name: '  Asha Rao ',
    email: '  ASHA@example.in ',
    password: 'a-strong-password',
  });

  assert.deepEqual(result, {
    name: 'Asha Rao',
    email: 'asha@example.in',
    password: 'a-strong-password',
  });
});

test('signup rejects short passwords and invalid email addresses', () => {
  assert.equal(signupSchema.safeParse({
    name: 'Asha Rao',
    email: 'not-an-email',
    password: 'short',
  }).success, false);
});

test('signin validates an email and a bounded password', () => {
  assert.equal(signinSchema.safeParse({
    email: 'asha@example.in',
    password: 'a-strong-password',
  }).success, true);
  assert.equal(signinSchema.safeParse({
    email: 'asha@example.in',
    password: 'x'.repeat(73),
  }).success, false);
});
