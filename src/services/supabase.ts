import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fjpavydwoalsfnexsmwq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqcGF2eWR3b2Fsc2ZuZXhzbXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExNTUwMTgsImV4cCI6MjAyNjczMTAxOH0.LgneVgoi1d7pDpyz8vS3EOUlxAvdUpjYN1nFcFkZ_ws";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
