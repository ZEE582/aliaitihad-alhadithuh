const path = require('path');
const sequelize = require(path.resolve(__dirname, '..', 'config', 'database.js'));

async function listForeignKeys(tableName) {
  const rows = await sequelize.query(
    `SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME
       FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :tableName
        AND REFERENCED_TABLE_NAME IS NOT NULL`,
    { replacements: { tableName }, type: sequelize.QueryTypes.SELECT }
  );
  return rows;
}

async function alterNotesForeignKeys() {
  const keys = await listForeignKeys('Notes');

  for (const key of keys) {
    await sequelize.query(
      `ALTER TABLE Notes DROP FOREIGN KEY \`${key.CONSTRAINT_NAME}\``
    );
  }

  await sequelize.query(
    `ALTER TABLE Notes
       ADD CONSTRAINT fk_notes_sender_user
       FOREIGN KEY (SenderID) REFERENCES Users (id),
       ADD CONSTRAINT fk_notes_receiver_user
       FOREIGN KEY (ReceiverID) REFERENCES Users (id)`
  );
}

(async () => {
  try {
    await alterNotesForeignKeys();
    const keys = await listForeignKeys('Notes');
    const onlyUsers = keys.every(
      (key) =>
        String(key.REFERENCED_TABLE_NAME).toLowerCase() === 'users' &&
        (key.COLUMN_NAME === 'SenderID' || key.COLUMN_NAME === 'ReceiverID')
    );
    console.log('Notes FK -> Users:', onlyUsers);
    console.log(JSON.stringify(keys));
  } catch (err) {
    console.error('fix_notes_fk failed:', err && err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
})();