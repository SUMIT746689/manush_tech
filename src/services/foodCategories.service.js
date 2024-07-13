const db = require('../models/index.js');
const helper = require('../utils/helper.util.js');
const config = require('../configs/general.config.js');
const { Op } = require('sequelize');

const FoodCategory = db.FoodCategory;

async function getMultiple(page = 1) {

  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await FoodCategory.findAll({ offset, limit: config.listPerPage });;
  const data = helper.emptyOrRows(rows);
  const meta = { page };
  return { data, meta };

}

async function getSingle({ id, name } = {}) {
  let where = { [Op.or]: {} };

  if (id) where[Op.or]["id"] = { [Op.eq]: id };
  if (name) where[Op.or]["name"] = { [Op.eq]: name };

  return await FoodCategory.findOne({ where });
}

async function create({ name }) {

  return FoodCategory.create({ name })
}

async function update(id, userDatas) {

  return FoodCategory.update(userDatas, { where: { id } })
}

async function remove(id) {
  return FoodCategory.destroy({
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
