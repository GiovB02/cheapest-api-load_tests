import { DataSource } from 'typeorm';

export default async () => {
  // Set NODE_ENV to test
  process.env.NODE_ENV = 'test';

  // Create a data source to drop and recreate the schema before tests
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'cheapest',
    entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
  });

  try {
    await dataSource.initialize();

    // Drop all tables
    await dataSource.dropDatabase();

    // Recreate database
    await dataSource.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'cheapest'}\``,
    );

    await dataSource.destroy();
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
};
