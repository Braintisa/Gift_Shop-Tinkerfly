import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ouiizeurdjvvlblijqpc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91aWl6ZXVyZGp2dmxibGlqcXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzUyNzgsImV4cCI6MjA4OTMxMTI3OH0.gBi8tNakRC7jRLudzCz3EnCCx7YM24p6iJcfW79idpc";

const storage = typeof window !== "undefined" ? window.localStorage : undefined;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
