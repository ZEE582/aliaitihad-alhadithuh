const sequelize = require('../config/database');
(async () => {
  try {
    await sequelize.query("ALTER TABLE `Users` MODIFY `roleType` ENUM('admin','teacher','parent','secretary') NOT NULL DEFAULT 'parent'");
    const [r] = await sequelize.query("SHOW COLUMNS FROM `Users` LIKE 'roleType'");
    console.log('new enum:', r[0].Type);
  } catch (e) {
    console.log('ERR:', e.message);
  } finally {
    await sequelize.close();
  }
})();