import { Controller, Get } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller('api/tiles')
export class TilesController {
  @Get()
  getTiles() {
    const jsonPath = path.join(process.cwd(), 'data', 'AAC', 'tiles.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      return JSON.parse(raw);
    }
    // fallback: try to load the TS-compiled module (may not work in prod)
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const tiles = require('../../../data/AAC/Tiles');
      return tiles && tiles.default ? tiles.default : tiles;
    } catch (e) {
      return { error: 'tiles not available' };
    }
  }
}
