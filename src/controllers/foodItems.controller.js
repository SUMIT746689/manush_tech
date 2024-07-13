const foodItems = require('../services/foodItems.service.js');

async function get(req, res, next) {
  try {
    res.json(await foodItems.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting food items`, err.message);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, foodCategoryId } = req.body;

    if (!name)
      return res.status(401).json({
        status: "failed",
        message: "provide name field",
      });

    const isAlreadyHave = await foodItems.getSingle({ name });

    if (isAlreadyHave)
      return res.status(401).json({
        status: "failed",
        message: "This food name isn't available ",
      });

    const datas = {
      name: name,
      foodCategoryId: foodCategoryId
    }

    res.json(await foodItems.create(datas));
  } catch (err) {
    console.error(`Error while creating food items`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { name, foodCategoryId } = req.body;

    const id = parseInt(req.params.id);
    if (Number.isNaN(id))
      return res.status(401).json({
        status: "failed",
        message: "provide valid food item id",
      });

    if (!name)
      return res.status(401).json({
        status: "failed",
        message: "no valid fields found to update",
      });

    // const isAlreadyHave = await foodItems.getSingle({ name });

    // if (isAlreadyHave)
    //   return res.status(401).json({
    //     status: "failed",
    //     message: "This food name isn't available to update",
    //   });

    const updateDatas = {
      name: name,
      foodCategoryId: foodCategoryId || undefined
    }
    const update = await foodItems.update(id, updateDatas)
    if (!update[0])
      return res.status(401).json({
        status: "failed",
        message: "failed to update",
      });

    res.status(200).json({ status: "success", message: "successfully updated" });
  } catch (err) {
    console.error(`Error while updating food item`, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id))
      return res.status(401).json({
        status: "failed",
        message: "provide valid food item id",
      });

    const deleteUser = await foodItems.remove(id);
    if (!deleteUser)
      return res.status(401).json({
        status: "failed",
        message: "failed to delete",
      });

    res.status(200).json({ status: "success", message: "successfully deleted" });
  } catch (err) {
    console.error(`Error while deleting food item`, err.message);
    next(err);
  }
}

module.exports = {
  get,
  create,
  update,
  remove
};
