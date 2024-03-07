import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators';
import { Role } from 'src/auth/interface/role.enum';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) {}
    @Get()
    @Auth( Role.Admin )
    @ApiOperation( { summary: 'Execute the seed service.' } )
    executeSeed() {
        return this.seedService.runSeed();
    }
}
