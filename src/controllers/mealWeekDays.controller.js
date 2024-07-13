const mealWeekDays = require('../services/mealWeekDays.service.js');

async function get(req, res, next) {
  try {
    res.json(await mealWeekDays.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting meal week days`, err.message);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { day } = req.body;

    if (!day)
      return res.status(401).json({
        status: "failed",
        message: "provide day field",
      });

    const isAlreadyHave = await mealWeekDays.getSingle({ day });

    if (isAlreadyHave)
      return res.status(401).json({
        status: "failed",
        message: "This meal week day isn't available ",
      });

    const datas = {
      day: day
    }

    res.json(await mealWeekDays.create(datas));
  } catch (err) {
    console.error(`Error while creating meal week days`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { day } = req.body;

    const id = parseInt(req.params.id);
    if (Number.isNaN(id))
      return res.status(401).json({
        status: "failed",
        message: "provide valid meal week day id",
      });

    if (!day)
      return res.status(401).json({
        status: "failed",
        message: "no valid fields found to update",
      });

    // const isAlreadyHave = await mealWeekDays.getSingle({ day });

    // if (isAlreadyHave)
    //   return res.status(401).json({
    //     status: "failed",
    //     message: "This food day isn't available to update",
    //   });

    const updateDatas = {
      day: day
    }
    const update = await mealWeekDays.update(id, updateDatas)
    if (!update[0])
      return res.status(401).json({
        status: "failed",
        message: "failed to update",
      });

    res.status(200).json({ status: "success", message: "successfully updated" });
  } catch (err) {
    console.error(`Error while updating meal week day`, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id))
      return res.status(401).json({
        status: "failed",
        message: "provide valid meal week day id",
      });

    const deleteUser = await mealWeekDays.remove(id);
    if (!deleteUser)
      return res.status(401).json({
        status: "failed",
        message: "failed to delete",
      });

    res.status(200).json({ status: "success", message: "successfully deleted" });
  } catch (err) {
    console.error(`Error while deleting meal week day`, err.message);
    next(err);
  }
}

module.exports = {
  get,
  create,
  update,
  remove
};
