import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yivprwimevsigivbhlam.supabase.co';
const supabaseAnonKey = 'sb_publishable_VPHCT0XHyUiGemp3LVQsAA_nEW3uBvr';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);