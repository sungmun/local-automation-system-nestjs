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
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RecipeCommandService } from './recipe-command.service';

@ApiTags('레시피')
@Controller('recipes')
export class RecipeController {
  private readonly logger = new Logger(RecipeController.name);
  constructor(
    private readonly recipeCrudService: RecipeCrudService,
    private readonly recipeCommandService: RecipeCommandService,
  ) {}

  @ApiOperation({ summary: '레시피 생성' })
  @ApiCreatedResponse({ type: CreateRecipeResponseDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createRecipeDto: CreateRecipeRequestDto,
  ): Promise<CreateRecipeResponseDto> {
    const result = await this.recipeCrudService.saveRecipe(createRecipeDto);
    return plainToInstance(CreateRecipeResponseDto, result);
  }

  @ApiOperation({ summary: '레시피 목록 조회' })
  @ApiOkResponse({ type: RecipeListResponseDto })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<RecipeListResponseDto> {
    const result = await this.recipeCrudService.findAll();
    return plainToInstance(RecipeListResponseDto, { list: result });
  }

  @ApiOperation({ summary: '레시피 상세 조회' })
  @ApiOkResponse({ type: DetailRecipeResponseDto })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<DetailRecipeResponseDto> {
    const result = await this.recipeCrudService.findOne(+id);
    return plainToInstance(DetailRecipeResponseDto, result);
  }

  @ApiOperation({ summary: '레시피 실행' })
  @ApiNoContentResponse()
  @Post(':id/execute')
  @HttpCode(HttpStatus.NO_CONTENT)
  async execute(@Param('id') id: string): Promise<void> {
    await this.recipeCommandService.runRecipe(+id);
  }

  @ApiOperation({ summary: '레시피 수정' })
  @ApiNoContentResponse()
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeRequestDto,
  ): Promise<void> {
    await this.recipeCrudService.update(+id, updateRecipeDto);
  }

  @ApiOperation({ summary: '레시피 삭제' })
  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.recipeCrudService.remove(+id);
  }
}
