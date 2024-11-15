import { Injectable } from '@nestjs/common';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  async executeSEED() {
    try {
      const { data } = await this.axios.get(
        'https://pokeapi.co/api/v2/pokemon?limit=1',
      );
      data.results.forEach(({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];
      });
      return data;
    } catch (error) {
      console.log('This Error line', error);
    }
  }
}
