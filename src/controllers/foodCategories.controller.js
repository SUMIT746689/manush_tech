const foodCategories = require('../services/foodCategories.service.js');

async function get(req, res, next) {
  try {
    res.json(await foodCategories.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting food categories`, err.message);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(401).json({
        status: "failed",
        message: "provide name field",
      });

    const isAlreadyHave = await foodCategories.getSingle({ name });

    if (isAlreadyHave)
      return res.status(401).json({
        status: "failed",
        message: "This food name isn't available ",
      });

    const datas = {
      name: name
    }

    res.json(await foodCategories.create(datas));
  } catch (err) {
    console.error(`Error while creating food categories`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { name } = req.body;

    const id = parseInt(req.params.id);
    if (Number.isNaN(id))
      return res.status(401).json({
        status: "failed",
        message: "provide valid food category id",
      });

    if (!name)
      return res.status(401).json({
        status: "failed",
        message: "no valid fields found to update",
      });

    // const isAlreadyHave = await foodCategories.getSingle({ name });

    // if (isAlreadyHave)
    //   return res.status(401).json({
    //     status: "failed",
    //     message: "This food name isn't available to update",
    //   });

    const updateDatas = {
      name: name
    }
    const update = await foodCategories.update(id, updateDatas)
    if (!update[0])
      return res.status(401).json({
        status: "failed",
        message: "failed to update",
      });

    res.status(200).json({ status: "success", message: "successfully updated" });
  } catch (err) {
    console.error(`Error while updating food category`, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id))
      return res.status(401).json({
        status: "failed",
        message: "provide valid food category id",
      });

    const deleteUser = await foodCategories.remove(id);
    if (!deleteUser)
      return res.status(401).json({
        status: "failed",
        message: "failed to delete",
      });

    res.status(200).json({ status: "success", message: "successfully deleted" });
  } catch (err) {
    console.error(`Error while deleting food category`, err.message);
    next(err);
  }
}

module.exports = {
  get,
  create,
  update,
  remove
};
