import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RecipeCrudService } from './recipe-crud.service';
import { CreateRecipeRequestDto, UpdateRecipeRequestDto } from './dto/request';
import {
  RecipeListResponseDto,
  CreateRecipeResponseDto,
  DetailRecipeResponseDto,
} from './dto/response';

@Controller('recipes')
export class RecipeController {
  private readonly logger = new Logger(RecipeController.name);
  constructor(private readonly recipeCrudService: RecipeCrudService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createRecipeDto: CreateRecipeRequestDto,
  ): Promise<CreateRecipeResponseDto> {
    const result = await this.recipeCrudService.saveRecipe(createRecipeDto);
    return plainToInstance(CreateRecipeResponseDto, result);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<RecipeListResponseDto> {
    const result = await this.recipeCrudService.findAll();
    return plainToInstance(RecipeListResponseDto, { list: result });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<DetailRecipeResponseDto> {
    const result = await this.recipeCrudService.findOne(+id);
    return plainToInstance(DetailRecipeResponseDto, result);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeRequestDto,
  ): Promise<void> {
    await this.recipeCrudService.update(+id, updateRecipeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.recipeCrudService.remove(+id);
  }
}
