import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config(); // garante que o .env seja carregado

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
