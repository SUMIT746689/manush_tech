const db = require('../models/index.js');
const helper = require('../utils/helper.util.js');
const config = require('../configs/general.config.js');
const { Op } = require('sequelize');

const FoodItem = db.FoodItem;

async function getMultiple(page = 1) {

  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await FoodItem.findAll({ include: { model: db.FoodCategory, as: 'foodCategory' }, offset, limit: config.listPerPage });;
  const data = helper.emptyOrRows(rows);
  const meta = { page };
  return { data, meta };

}

async function getSingle({ id, name } = {}) {
  let where = { [Op.or]: {} };

  if (id) where[Op.or]["id"] = { [Op.eq]: id };
  if (name) where[Op.or]["name"] = { [Op.eq]: name };

  const resUser = await FoodItem.findOne({ where });
  return resUser;
}

async function create({ name, foodCategoryId }) {

  return FoodItem.create({ name, foodCategoryId })
}

async function update(id, userDatas) {

  return FoodItem.update(userDatas, { where: { id } })
}

async function remove(id) {
  return FoodItem.destroy({
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
