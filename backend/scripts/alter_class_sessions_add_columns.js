const path = require('path');
const sequelize = require(path.resolve(__dirname, '..', 'config', 'database.js'));

const TABLE = 'classSessions';

const COLUMNS = [
  { name: 'Duration', definition: 'VARCHAR(50) NULL' },
  { name: 'Notes', definition: 'TEXT NULL' },
  { name: 'teacher_PersonID', definition: 'INT NULL' }
];

const TEACHER_FK = {
  name: 'fk_session_teacher',
  sql: 'ALTER TABLE `classSessions` ADD CONSTRAINT `fk_session_teacher` FOREIGN KEY (`teacher_PersonID`) REFERENCES `Teachers` (`PersonID`) ON DELETE SET NULL ON UPDATE CASCADE'
};

async function existingColumns() {
  const rows = await sequelize.query(
    `SELECT COLUMN_NAME
       FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :table
      ORDER BY ORDINAL_POSITION`,
    { replacements: { table: TABLE }, type: sequelize.QueryTypes.SELECT }
  );
  return rows.map((r) => r.COLUMN_NAME);
}

async function hasForeignKey(name) {
  const rows = await sequelize.query(
    `SELECT CONSTRAINT_NAME
       FROM information_schema.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :table
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        AND CONSTRAINT_NAME = :name`,
    { replacements: { table: TABLE, name }, type: sequelize.QueryTypes.SELECT }
  );
  return rows.length > 0;
}

async function main() {
  const rows = await sequelize.query('SELECT DATABASE() AS dbName', {
    type: sequelize.QueryTypes.SELECT
  });
  const dbName = rows[0] ? rows[0].dbName : null;
  const apply = process.env.ALLOW_ALTER === 'true';

  console.log(`Database: ${dbName}`);
  console.log(`Mode: ${apply ? 'APPLY' : 'DRY-RUN (set ALLOW_ALTER=true to apply)'}`);

  const existing = await existingColumns();
  const missing = COLUMNS.filter((c) => !existing.includes(c.name));

  if (missing.length === 0) {
    console.log(`All columns already present on ${TABLE} - nothing to do.`);
  } else {
    for (const col of missing) {
      if (apply) {
        await sequelize.query(`ALTER TABLE \`${TABLE}\` ADD COLUMN \`${col.name}\` ${col.definition}`);
        console.log(`Added column ${col.name}`);
      } else {
        console.log(`Would add column ${col.name} ${col.definition}`);
      }
    }
  }

  const needFk = !(await hasForeignKey(TEACHER_FK.name));
  if (needFk) {
    if (apply) {
      await sequelize.query(TEACHER_FK.sql);
      console.log(`Added foreign key ${TEACHER_FK.name}`);
    } else {
      console.log(`Would add foreign key ${TEACHER_FK.name}`);
    }
  } else {
    console.log(`Foreign key ${TEACHER_FK.name} already present - nothing to do.`);
  }

  if (apply) {
    const after = await existingColumns();
    console.log('Columns now:', JSON.stringify(after));
  }
}

(async () => {
  try {
    await main();
  } catch (err) {
    console.error('alter_class_sessions_add_columns failed:', err && err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
})();
