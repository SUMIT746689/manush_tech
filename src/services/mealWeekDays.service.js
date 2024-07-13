const db = require('../models/index.js');
const helper = require('../utils/helper.util.js');
const config = require('../configs/general.config.js');
const { Op } = require('sequelize');

const MealWeekDay = db.MealWeekDay;

async function getMultiple(page = 1) {

  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await MealWeekDay.findAll({ offset, limit: config.listPerPage });;
  const data = helper.emptyOrRows(rows);
  const meta = { page };
  return { data, meta };

}

async function getSingle({ id, day } = {}) {
  let where = { [Op.or]: {} };

  if (id) where[Op.or]["id"] = { [Op.eq]: id };
  if (day) where[Op.or]["day"] = { [Op.eq]: day };

  return await MealWeekDay.findOne({ where });
}

async function create({ day }) {

  return MealWeekDay.create({ day })
}

async function update(id, userDatas) {

  return MealWeekDay.update(userDatas, { where: { id } })
}

async function remove(id) {
  return MealWeekDay.destroy({
    where: { id }
  });
}

module.exports = {
  getMultiple,
  getSingle,
  create,
  update,
  remove
}
