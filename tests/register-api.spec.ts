import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

test('Register API - create user and profile', async ({ request }) => {
  const email = `test_${Date.now()}@gmail.com`;
  const password = 'Password123!';
  const username = `user_${Date.now()}`;

  // 1. Register Auth
  const signupResponse = await request.post(
    `${supabaseUrl}/auth/v1/signup`,
    {
      headers: {
        apikey: supabaseKey,
        'Content-Type': 'application/json',
      },
      data: {
        email,
        password,
      },
    }
  );

  expect(signupResponse.status()).toBe(200);

  const signupBody = await signupResponse.json();

  const userId = signupBody.user.id;
  const accessToken = signupBody.access_token;

  expect(userId).toBeTruthy();

  // 2. Create profile
  const profileResponse = await request.post(
    `${supabaseUrl}/rest/v1/profiles`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      data: {
        id: userId,
        username,
      },
    }
  );

  expect(profileResponse.status()).toBe(201);

  const profileBody = await profileResponse.json();

  expect(profileBody[0].id).toBe(userId);
  expect(profileBody[0].username).toBe(username);
});