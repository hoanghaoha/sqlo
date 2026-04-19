import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;


export const supabase = createClient(
  supabaseUrl!,
  supabaseKey!,
)

export async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard` // redirect after login
    }
  })
}

export async function signOut() {
  await supabase.auth.signOut()
}

// Get current session anywhere
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
