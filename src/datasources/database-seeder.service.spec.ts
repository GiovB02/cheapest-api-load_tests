import { DataSource } from 'typeorm';
import { DatabaseSeederService } from './database-seeder.service';

describe('DatabaseSeederService', () => {
  let service: DatabaseSeederService;
  let mockQueryRunner: { query: jest.Mock };

  beforeEach(() => {
    const dataSource = {
      synchronize: jest.fn().mockResolvedValue(undefined),
      createQueryRunner: jest.fn(),
    } as unknown as DataSource;

    service = new DatabaseSeederService(dataSource);
    mockQueryRunner = { query: jest.fn().mockResolvedValue([]) };
  });

  describe('extractSqlStatements', () => {
    it('strips comment lines before splitting so INSERT statements are not lost', () => {
      const sql = [
        '-- Header comment',
        '',
        '-- Items de Inventario',
        "INSERT INTO items_inventario (id) VALUES ('1');",
        '',
        '-- Productos',
        "INSERT INTO productos (id) VALUES ('2');",
      ].join('\n');

      const result = (service as any).extractSqlStatements(sql) as string[];

      expect(result).toEqual([
        "INSERT INTO items_inventario (id) VALUES ('1')",
        "INSERT INTO productos (id) VALUES ('2')",
      ]);
    });

    it('returns empty array for comment-only SQL', () => {
      const result = (service as any).extractSqlStatements(
        '-- only comments\n-- nothing else\n',
      ) as string[];
      expect(result).toEqual([]);
    });
  });

  describe('makeStatementIdempotent', () => {
    it('appends ON CONFLICT DO NOTHING to INSERT statements', () => {
      const stmt = "INSERT INTO productos (id) VALUES ('abc')";
      const result = (service as any).makeStatementIdempotent(stmt) as string;
      expect(result).toBe(
        "INSERT INTO productos (id) VALUES ('abc') ON CONFLICT DO NOTHING",
      );
    });

    it('leaves non-INSERT statements unchanged', () => {
      const stmt = 'SELECT 1';
      expect((service as any).makeStatementIdempotent(stmt)).toBe(stmt);
    });
  });

  describe('batchInsert', () => {
    it('renders nulls, numbers, and escaped strings correctly', async () => {
      await (service as any).batchInsert(
        mockQueryRunner,
        'INSERT INTO test_table (id, nota, cantidad, "productoId") VALUES',
        [['test-id', "O'Reilly", 3, null]],
      );

      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        `INSERT INTO test_table (id, nota, cantidad, "productoId") VALUES\n('test-id', 'O''Reilly', 3, NULL)`,
      );
    });

    it('batches rows into chunks of the given batchSize', async () => {
      const rows = Array.from({ length: 5 }, (_, i) => [`id-${i}`]);

      await (service as any).batchInsert(
        mockQueryRunner,
        'INSERT INTO t (id) VALUES',
        rows,
        2,
      );

      // ceil(5 / 2) = 3 queries
      expect(mockQueryRunner.query).toHaveBeenCalledTimes(3);
    });

    it('does nothing when the rows array is empty', async () => {
      await (service as any).batchInsert(
        mockQueryRunner,
        'INSERT INTO t (id) VALUES',
        [],
      );

      expect(mockQueryRunner.query).not.toHaveBeenCalled();
    });
  });

  describe('buildMissingCatalogoProductoPairs', () => {
    it('generates only pairs not already in existingPairs', () => {
      const existing = new Set(['catalogo-1:producto-1']);

      const rows = (service as any).buildMissingCatalogoProductoPairs(
        ['catalogo-1', 'catalogo-2'],
        ['producto-1', 'producto-2'],
        existing,
        3,
      ) as string[][];

      expect(rows).toEqual([
        ['catalogo-1', 'producto-2'],
        ['catalogo-2', 'producto-1'],
        ['catalogo-2', 'producto-2'],
      ]);
    });

    it('throws when not enough unique pairs can be generated', () => {
      expect(() =>
        (service as any).buildMissingCatalogoProductoPairs(
          ['c1'],
          ['p1'],
          new Set(['c1:p1']),
          1,
        ),
      ).toThrow();
    });
  });
});
