// seed.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http :AxiosAdapter

  ) {}

  async executeSEED() {
    try {
      const pokemonsToInsert: Pokemon[] = [];
        await this.pokemonModel.deleteMany();
      const data = await this.http.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=1000',
      );
      data.results.map(async ({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];
       pokemonsToInsert.push(new this.pokemonModel({ name, no }));
      });

      await this.pokemonModel.insertMany(pokemonsToInsert);
      return `Seed Executed with ${pokemonsToInsert.length} documents`;

    } catch (error) {
      console.log('Error >>>', error);
      throw new Error(error);
    }
  }
}