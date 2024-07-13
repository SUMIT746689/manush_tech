const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require("./src/services/db.service.js");
const userRoute = require("./src/routes/usersRoute.js");
const authRoute = require("./src/routes/authRoute.js");
const foodCategoryRoute = require("./src/routes/foodCategoriesRoute.js");
const foodItemRoute = require("./src/routes/foodItemsRoute.js");
const mealWeekDayRoute = require("./src/routes/mealWeekDay.js");

const cors = require('cors')
const dotenv = require("dotenv");

dotenv.config();

sequelize.sync(
  // { force: true }
  { alter: true }
)
  .then(() => console.log("Synced db."))
  .catch((err) => console.log("Failed to sync db: " + err.message));


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const corsOpts = {
  origin: 'http://localhost:5173',
  // origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Type']
};
app.use(cors(corsOpts))


app.get('/', (req, res) => {
  res.json({ 'message': 'ok' });
})

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   res.header('Access-Control-Request-Headers', '*');
//   // if (req.method === "OPTIONS") {
//   res.header('Access-Control-Allow-Methods', '*');
//   // return res.status(200).json({});
//   // }
//   next();
// });

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/food_categories', foodCategoryRoute);
app.use('/api/food_items', foodItemRoute);
app.use('/api/meal_week_days', mealWeekDayRoute);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const { customMessage, stack } = err;
  const statusCode = err.statusCode || 500;

  console.error(err.message, stack);
  res.status(statusCode).json({ 'message': err.message });
  // res.status(statusCode).json({ message: customMessage, error: err.message });

  return;
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
