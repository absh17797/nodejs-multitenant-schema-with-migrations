module.exports.up = async function(db) {
  await db.collection('vehicles').updateMany(
    { is_active: { $exists: false } },
    { $set: { is_active: true } }
  );
};
module.exports.down = async function(db) {
  await db.collection('vehicles').updateMany(
    { is_active: true },
    { $unset: { is_active: "" } }
  );
};