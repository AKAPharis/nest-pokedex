import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';
import { PokemonResponse } from './interfaces/pokemon-response.dto';


@Injectable()
export class SeedService {

  private readonly axiosProvider: AxiosInstance = axios;

  async populateDB(){
    const {data} = await this.axiosProvider.get<PokemonResponse>("https://pokeapi.co/api/v2/pokemon?limit=10");
    return data;
  }
}
