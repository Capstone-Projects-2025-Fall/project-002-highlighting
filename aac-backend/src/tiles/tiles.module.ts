import { Module } from '@nestjs/common';
import { TilesController } from './tiles.controller';

@Module({
  controllers: [TilesController],
})
export class TilesModule {}
