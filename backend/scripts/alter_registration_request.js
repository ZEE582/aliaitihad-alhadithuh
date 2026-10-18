const sequelize = require('../config/database');

(async () => {
  try {
    const adds = [
      "ADD COLUMN `fatherNationalId` VARCHAR(50) NULL",
      "ADD COLUMN `fatherEmail` VARCHAR(100) NULL",
      "ADD COLUMN `twins` JSON NULL"
    ];
    for (const stmt of adds) {
      try {
        await sequelize.query(`ALTER TABLE \`RegistrationRequests\` ${stmt}`);
        console.log('added:', stmt.split('`')[1]);
      } catch (e) {
        if (/Duplicate column/i.test(e.message)) console.log('exists:', stmt.split('`')[1]);
        else throw e;
      }
    }
    const [cols] = await sequelize.query("SHOW COLUMNS FROM `RegistrationRequests` WHERE Field IN ('fatherNationalId','fatherEmail','twins')");
    console.log('columns now:', cols.map(c => `${c.Field}:${c.Type}`).join(' | '));
  } catch (e) {
    console.log('ERR:', e.message);
  } finally {
    await sequelize.close();
  }
})();