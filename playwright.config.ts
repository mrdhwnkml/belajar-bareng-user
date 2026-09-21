import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.SUPABASE_URL,
  },
});