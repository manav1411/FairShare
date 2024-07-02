import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://msjftwdhdwwtjvzxannc.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zamZ0d2RoZHd3dGp2enhhbm5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTc5MTE3MiwiZXhwIjoyMDM1MzY3MTcyfQ.EeOHPM1s6qMegZokQSqJplbsgcTeiz-vzeOnsxT_9Oc"

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
