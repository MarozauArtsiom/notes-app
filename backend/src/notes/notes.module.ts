import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  controllers: [NotesController],
  providers: [
    NotesService,
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [NotesService],
})
export class NotesModule {}