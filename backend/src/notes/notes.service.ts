import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  private notes: Note[] = [];

  create(createNoteDto: CreateNoteDto): Note {
    const note: Note = {
      id: uuidv4(),
      title: createNoteDto.title,
      content: createNoteDto.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.notes.push(note);
    return note;
  }

  findAll(): Note[] {
    return this.notes;
  }

  findOne(id: string): Note | undefined {
    return this.notes.find((note) => note.id === id);
  }

  update(id: string, updateNoteDto: UpdateNoteDto): Note | undefined {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) {
      return undefined;
    }

    const updatedNote = {
      ...this.notes[noteIndex],
      ...updateNoteDto,
      updatedAt: new Date().toISOString(),
    };

    this.notes[noteIndex] = updatedNote;
    return updatedNote;
  }

  remove(id: string): boolean {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) {
      return false;
    }

    this.notes.splice(noteIndex, 1);
    return true;
  }

  // Method to clear notes for testing
  clearNotes(): void {
    this.notes = [];
  }
}