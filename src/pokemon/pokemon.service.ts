import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { isString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { ConfigService } from '@nestjs/config';
import { envs } from 'src/config/env';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      let { name, ...createDto } = createPokemonDto;
      name = name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create({ ...createDto, name });
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<{ data: any[]; meta: { total: number; page: number; lastPage: number } }> {
    const { page, limit , orderBy, name, filter = {} } = paginationDto as PaginationDto;
    const skip = (page - 1) * limit;
  
    // Agregar el filtro por nombre si está presente
    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // Búsqueda insensible a mayúsculas y minúsculas
    }
    
    const total = await this.pokemonModel.countDocuments(filter);
    const lastPage = Math.ceil(total / limit);
  
    const data = await this.pokemonModel
      .find(filter)
      .sort({ [orderBy]: 1 }) // Ordenar por el campo especificado en orderBy
      .skip(skip)
      .limit(limit) // Verificar si limit es válido
      .select('-__v') // Excluir el campo __v
      .lean() // Devuelve objetos JavaScript simples
      .exec();  

  
    return {
      data,
      meta: {
        total,
        page,
        lastPage,
      },
    };
  }

  async findOne(term: string): Promise<Pokemon | null> {
    console.log(
      '🚀 ~ file: pokemon.service.ts:43 ~ PokemonService ~ findOne ~ term:',
      term,
    );
    try {
      let pokemon;

      // Si es un número, buscamos por el campo 'no'
      if (!isNaN(+term)) {
        pokemon = await this.pokemonModel.findOne({ no: term });
      }
      // Si es un ObjectId de MongoDB, buscamos por _id
      else if (isValidObjectId(term)) {
        pokemon = await this.pokemonModel.findById(term);
      }
      // Si es un string, buscamos por nombre
      else if (isString(term)) {
        pokemon = await this.pokemonModel.findOne({ name: term });
      }

      return pokemon;
    } catch (error) {
      throw new InternalServerErrorException(
        `Can't find pokemon with term "${term}"`,
      );
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    let filter: { _id?: string; no?: number; name?: string } = {};

    try {
      // Determinar el filtro según el tipo de 'term'
      if (!isNaN(+term)) {
        filter.no = +term; // Si 'term' es un número, busca por 'no'
      } else if (isValidObjectId(term)) {
        filter._id = term; // Si 'term' es un ObjectId, busca por '_id'
      } else {
        filter.name = term; // Si es una cadena, busca por 'name'
      }

      // Verificar si ya existe un Pokémon con el mismo 'no' o 'name', excepto el actual que se está actualizando
      const existingPokemon = await this.pokemonModel.findOne({
        $or: [{ no: updatePokemonDto.no }, { name: updatePokemonDto.name }],
        _id: { $ne: filter._id }, // Asegurarse de que no sea el mismo Pokémon que se está actualizando
      });

      // Actualizar el Pokémon si no hay duplicados
      const pokemon = await this.pokemonModel.findOneAndUpdate(
        filter,
        updatePokemonDto,
        { new: true }, // Devolver el Pokémon actualizado
      );

      if (!pokemon) {
        throw new BadRequestException(
          `Pokemon with identifier "${term}" not found`,
        );
      }

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon with identifier "${JSON.stringify(error.keyValue)}" already exists`,
      );
    } else {
      if (error instanceof BadRequestException) {
        throw error;
      }
    }

    throw new InternalServerErrorException(
      'An unexpected error occurred while processing the Pokemon.',
    );
  }

  async remove(id: string) {
    try {
      const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
      if (deletedCount === 0) {
        throw new BadRequestException(
          `Pokemon with identifier "${id}" not found`,
        );
      }
    } catch (error) {
      this.handleExceptions(error);
    }
  }
}
