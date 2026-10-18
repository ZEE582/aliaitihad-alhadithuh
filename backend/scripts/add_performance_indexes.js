const path = require('path');
const sequelize = require(path.resolve(__dirname, '..', 'config', 'database.js'));

const TARGETS = [
  { table: 'Child_Guardians', name: 'idx_child_guardians_gid', columns: ['GID'] },
  { table: 'Child_Guardians', name: 'idx_child_guardians_child', columns: ['child_PersonID'] },
  { table: 'Children', name: 'idx_children_section_id', columns: ['section_id'] },
  { table: 'Attendances', name: 'idx_attendances_child', columns: ['child_PersonID'] },
  { table: 'Sections', name: 'idx_sections_assigned_teacher', columns: ['assigned_teacher_id'] }
];

async function hasLeadingIndex(table, columns) {
  const rows = await sequelize.query(
    `SELECT COUNT(*) AS c
       FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :table
        AND SEQ_IN_INDEX = 1
        AND COLUMN_NAME = :column`,
    { replacements: { table, column: columns[0] }, type: sequelize.QueryTypes.SELECT }
  );
  return Number(rows[0].c) > 0;
}

async function addIndexes() {
  const dbRow = await sequelize.query('SELECT DATABASE() AS db', {
    type: sequelize.QueryTypes.SELECT
  });
  console.log('Target database:', dbRow[0] && dbRow[0].db);

  for (const target of TARGETS) {
    const exists = await hasLeadingIndex(target.table, target.columns);
    if (exists) {
      console.log(`skip  ${target.table}.${target.columns.join(', ')} (leading index already present)`);
      continue;
    }
    const cols = target.columns.map((c) => `\`${c}\``).join(', ');
    await sequelize.query(`ALTER TABLE \`${target.table}\` ADD INDEX \`${target.name}\` (${cols})`);
    console.log(`added ${target.table}.${target.name} (${target.columns.join(', ')})`);
  }
}

(async () => {
  try {
    await addIndexes();
    console.log('add_performance_indexes done');
  } catch (err) {
    console.error('add_performance_indexes failed:', err && err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
})();
