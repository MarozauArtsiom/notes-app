import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesService],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  afterEach(() => {
    // Clear notes after each test
    service.clearNotes();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new note', () => {
      const createNoteDto = {
        title: 'Test Note',
        content: 'Test content',
      };

      const result = service.create(createNoteDto);

      expect(result).toMatchObject({
        title: 'Test Note',
        content: 'Test content',
      });
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no notes exist', () => {
      const result = service.findAll();
      expect(result).toEqual([]);
    });

    it('should return all notes when notes exist', () => {
      // Create two notes
      const note1 = service.create({
        title: 'Test Note 1',
        content: 'Test content 1',
      });

      const note2 = service.create({
        title: 'Test Note 2',
        content: 'Test content 2',
      });

      const result = service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject(note1);
      expect(result[1]).toMatchObject(note2);
    });
  });

  describe('findOne', () => {
    it('should return a note by ID', () => {
      const createdNote = service.create({
        title: 'Test Note',
        content: 'Test content',
      });

      const result = service.findOne(createdNote.id);

      expect(result).toMatchObject(createdNote);
    });

    it('should return undefined for non-existent note', () => {
      const result = service.findOne('non-existent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a note', () => {
      const createdNote = service.create({
        title: 'Original Title',
        content: 'Original content',
      });

      // Add a small delay to ensure different timestamps
      const updateNoteDto = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const result = service.update(createdNote.id, updateNoteDto);

      expect(result).toMatchObject({
        id: createdNote.id,
        title: 'Updated Title',
        content: 'Updated content',
      });
      expect(result).toHaveProperty('updatedAt');
    });

    it('should return undefined for non-existent note', () => {
      const updateNoteDto = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const result = service.update('non-existent-id', updateNoteDto);

      expect(result).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove a note', () => {
      const createdNote = service.create({
        title: 'Test Note',
        content: 'Test content',
      });

      const result = service.remove(createdNote.id);

      expect(result).toBe(true);
      expect(service.findAll()).toHaveLength(0);
    });

    it('should return false for non-existent note', () => {
      const result = service.remove('non-existent-id');
      expect(result).toBe(false);
    });
  });
});