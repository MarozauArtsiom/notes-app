import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto): Note {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  findAll(): Note[] {
    return this.notesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Note {
    const note = this.notesService.findOne(id);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto): Note {
    const note = this.notesService.update(id, updateNoteDto);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    const result = this.notesService.remove(id);
    if (!result) {
      throw new NotFoundException('Note not found');
    }
  }

  // Test endpoint to clear all notes
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  clearAll(): void {
    this.notesService.clearNotes();
  }
}