import { Module } from '@nestjs/common';
import { DatabaseSeederService } from './database-seeder.service';
import { databaseProviders } from './database.providers';

@Module({
  providers: [...databaseProviders, DatabaseSeederService],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
