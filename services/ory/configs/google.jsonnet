local claims = {
  email_verified: false,
} + std.extVar('claims');

{
  identity: {
    traits: {
      [if 'email' in claims && claims.email_verified then 'email' else null]: claims.email,
      [if 'name' in claims then 'name' else null]: claims.name,
      [if 'picture' in claims then 'picture' else null]: claims.picture,
    },
  },
}