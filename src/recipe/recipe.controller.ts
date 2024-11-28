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
import { CreateRecipeRequestDto } from './dto/request/create-recipe-request.dto';
import { UpdateRecipeRequestDto } from './dto/request/update-recipe-request.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { RecipeCrudService } from './recipe-crud.service';
import { RecipeCommandService } from './recipe-command.service';
import { plainToInstance } from 'class-transformer';
import { RecipeListResponseDto } from './dto/response/list-recipe-response.dto';
import { CreateRecipeResponseDto } from './dto/response/create-recipe-response.dto';
import { DetailRecipeResponseDto } from './dto/response/detail-recipe-response.dto';

@Controller('recipe')
export class RecipeController {
  private readonly logger = new Logger(RecipeController.name);
  constructor(
    private readonly recipeCrudService: RecipeCrudService,
    private readonly recipeCommandService: RecipeCommandService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createRecipeDto: CreateRecipeRequestDto,
  ): Promise<CreateRecipeResponseDto> {
    const result = await this.recipeCrudService.saveRecipe(createRecipeDto);
    return plainToInstance(CreateRecipeResponseDto, result);
  }

  @Get()
  async findAll(): Promise<RecipeListResponseDto> {
    const result = await this.recipeCrudService.findAll();
    return plainToInstance(RecipeListResponseDto, { list: result });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DetailRecipeResponseDto> {
    const result = await this.recipeCrudService.findOne(+id);
    return plainToInstance(DetailRecipeResponseDto, result);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeRequestDto,
  ): Promise<void> {
    await this.recipeCrudService.update(+id, updateRecipeDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.recipeCrudService.remove(+id);
  }

  @OnEvent('recipe.condition.check', { async: true })
  async recipeConditionCheck(data: any): Promise<void> {
    this.logger.log('recipeConditionCheck', data);
    const isRecipeCondition = await this.recipeCommandService.recipeCheck(
      data.recipeId,
    );
    this.logger.log('recipeConditionCheck run', isRecipeCondition);
    if (isRecipeCondition) {
      await this.recipeCommandService.runRecipe(data.recipeId);
    }
  }
}
