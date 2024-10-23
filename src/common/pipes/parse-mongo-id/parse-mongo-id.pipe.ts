import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log("🚀 ~ file: parse-mongo-id.pipe.ts:6 ~ ParseMongoIdPipe ~ transform ~ value:", value , metadata)
    if(!isValidObjectId(value)){
     throw new BadRequestException(`${value} is not a valid id`)
    }

return value;
  }
}
