import prisma from "@/lib/prisma_client";
import { logFile } from "utilities_api/handleLogFile";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export default async function put(req, res) {
  try {
    console.log(process.env.SALTROUNDS);
    if (!req.body.username && !req.body.password)
      throw new Error(`provide username and password`);

    const user = await prisma.user.findFirst({
      where: { username: req.body.username }
    });

    if (user) {
      //   bcrypt.hash(user.password, Number(process.env.SALTROUNDS), function(err, hash) {
      //     console.log({err,hash})
      // });
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        const jwtRes = await jwt.sign("mehedi", process.env.JWT_SECRET_KEY, { algorithm: 'RS256' });
        // console.log({ jwtRes })
        res.status(200).json({ user });
      } else throw new Error(`Invalid username and password`);
    } else throw new Error(`Invalid Authorization`);
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ err: err.message });
  }
}
