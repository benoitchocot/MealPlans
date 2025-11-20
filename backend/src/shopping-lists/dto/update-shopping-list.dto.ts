import { PartialType } from '@nestjs/mapped-types';
import { CreateShoppingListDto } from './create-shopping-list.dto';

export class UpdateShoppingListDto extends PartialType(CreateShoppingListDto) { }
