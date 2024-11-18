import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration, envs } from './config/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(envs.urlMongoDB),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
  })
export class AppModule {
  constructor() {
    console.log(process.env);
  }
}
