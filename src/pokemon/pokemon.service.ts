import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit : number ;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly model: Model<Pokemon>,
    private readonly configService: ConfigService,
  ){
    this.defaultLimit = configService.get<number>('defaultLimit') as number;
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    const pokemonWithSameName = await this.model.findOne({name: createPokemonDto.name});
    const pokemonWithSameNo = await this.model.findOne({no: createPokemonDto.no});

    if(pokemonWithSameName){
      throw new BadRequestException(`The name '${createPokemonDto.name}' already exist`);
    }
    
    if(pokemonWithSameNo){
      throw new BadRequestException(`The number '${createPokemonDto.no}' already exist`);
    }
    const pokemon = await this.model.create( createPokemonDto );
    return pokemon;
  }

  findAll(paginationDto: PaginationDto) {
    const {limit = this.defaultLimit, offset = 0} = paginationDto;
    return this.model.find()
    .limit(limit)
    .skip(offset)
    .sort({
      no: 1
    });
  }

  async findOne(term: string) {

    let pokemon: Pokemon | null = null;

    if( !isNaN(+term) ){
      pokemon = await this.model.findOne({ no: term });
    }

    if( isValidObjectId(term)){
      pokemon = await this.model.findById(term);
    }
    
    if( !pokemon ){
      pokemon = await this.model.findOne({name: term.toLowerCase().trim()});
    }
    if( !pokemon ){
      throw new NotFoundException(`Pokemon with id, name or no '${term}' was not found`);
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    let pokemon = await this.findOne(term);
    if(pokemon.name)
      pokemon.name = pokemon.name.toLowerCase();

    try{
      await pokemon.updateOne(updatePokemonDto);

      return {...pokemon.toJSON(), ...updatePokemonDto};
    }catch(ex){
      if(ex.code === 11000){
        throw new BadRequestException(`Pokemon exist in db '${JSON.stringify(ex.keyValue)}`)
      }
      console.log(ex);
      throw new InternalServerErrorException(`Can't update the pokemon - Check server logs`);
    }
  }

  async remove(id: string) {
    const {deletedCount} = await this.model.deleteOne({_id: id});
    if(deletedCount === 0)
      throw new BadRequestException(`The pokemon with the id ${id} was not found`);
    return;
  }
}
