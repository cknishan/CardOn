# Supabase deployment

The SQL schema and Edge Functions in this directory must be deployed to the same Supabase project
used by the CardOn frontend.

## Deploy account deletion

The `delete-account` function validates the signed-in caller and uses Supabase's server-provided
service-role credential to permanently delete that caller's Auth user. The existing foreign keys in
`schema.sql` cascade the deletion to decks, flashcards, and study sessions.

From the repository root:

```powershell
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase functions deploy delete-account --no-verify-jwt
```

The deployment disables the legacy gateway JWT check because the function validates the caller's
access token directly with `auth.getUser()` before using any privileged operation. Requests without
a valid signed-in user are rejected.

Do not add `SUPABASE_SERVICE_ROLE_KEY` to the frontend `.env` file. Supabase provides
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` automatically inside hosted
Edge Functions.

Test this workflow with a disposable user before enabling it for production users.
