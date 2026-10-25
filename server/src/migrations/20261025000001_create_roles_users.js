export async function up(knex) {
  await knex.schema.createTable('roles', (t) => {
    t.increments('id');
    t.string('name', 30).notNullable().unique();
  });

  await knex('roles').insert([
    { name: 'donor' },
    { name: 'recipient' },
    { name: 'hospital' },
    { name: 'blood_bank' },
    { name: 'volunteer' },
    { name: 'admin' },
  ]);

  await knex.schema.createTable('users', (t) => {
    t.increments('id');
    t.string('name', 120).notNullable();
    t.string('email', 190).notNullable().unique();
    t.string('phone', 30).nullable();
    t.string('password_hash', 100).notNullable();
    t.integer('role_id').unsigned().notNullable().references('id').inTable('roles');
    t.boolean('email_verified').notNullable().defaultTo(false);
    t.string('verification_token', 100).nullable().index();
    t.dateTime('verification_expires').nullable();
    t.string('reset_token', 100).nullable().index();
    t.dateTime('reset_expires').nullable();
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('donor_profiles', (t) => {
    t.increments('id');
    t.integer('user_id').unsigned().notNullable().unique().references('id').inTable('users').onDelete('CASCADE');
    t.enu('blood_group', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).nullable();
    t.enu('gender', ['male', 'female', 'other']).nullable();
    t.date('date_of_birth').nullable();
    t.decimal('weight_kg', 5, 1).nullable();
    t.string('city', 80).nullable();
    t.string('address', 255).nullable();
    t.decimal('latitude', 10, 7).nullable();
    t.decimal('longitude', 10, 7).nullable();
    t.boolean('is_available').notNullable().defaultTo(true);
    t.date('last_donation_date').nullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable('audit_logs', (t) => {
    t.increments('id');
    t.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
    t.string('action', 80).notNullable();
    t.string('ip', 64).nullable();
    t.text('meta').nullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('audit_logs');
  await knex.schema.dropTableIfExists('donor_profiles');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('roles');
}
