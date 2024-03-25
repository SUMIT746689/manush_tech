import fs from "fs";
import { logFile } from "./handleLogFile";

export const handleDeleteFile = (path) => {
    fs.unlink(path, (err) => {
        logFile.error(err)
        console.log({ err });
    });
};

export const handleDeleteMuiltiFiles = (files) => {
    for (const i in files) {
      fs.unlink(files[i].filepath, (err) => {
        logFile.error(err)
      })
    }
  }