import bcrypt from 'bcrypt';

// Creates a default admin (email already verified). CHANGE THE PASSWORD after first login.
export async function seed(knex) {
  const email = 'admin@blooddonation.local';
  const exists = await knex('users').where({ email }).first();
  if (exists) return;

  const role = await knex('roles').where({ name: 'admin' }).first();
  await knex('users').insert({
    name: 'System Admin',
    email,
    password_hash: await bcrypt.hash('Admin12345', 10),
    role_id: role.id,
    email_verified: true,
  });
}
