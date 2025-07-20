import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iqexempgykricaxbrhjo.supabase.co'; // Replace with your Supabase URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZXhlbXBneWtyaWNheGJyaGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTA5NTMsImV4cCI6MjA1NzI4Njk1M30.DZ4K1fI6PRZdPUEE0pD-DOpHpEOhvKZY5FKQ3fpKK8w'; // Replace with your Supabase public anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;
