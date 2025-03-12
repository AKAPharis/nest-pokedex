import { Injectable } from '@nestjs/common';
import { PokemonResponse } from './interfaces/pokemon-response.dto';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly model: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}

  async populateDB(){
    await this.model.deleteMany({});
    const data = await this.http.get<PokemonResponse>("https://pokeapi.co/api/v2/pokemon?limit=700");
    const pokemonToInsert: {name: string, no: number}[] = [];

    data.results.forEach(async ({name, url}) => {

      let segments =  url.split("/");
      let no = +segments[segments.length - 2];
      pokemonToInsert.push({name, no});


    });
    await this.model.insertMany(pokemonToInsert);
    return {message: 'seed succeded'};
  }
}
