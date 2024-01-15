import fs from "fs";
import { logFile } from "./handleLogFile";

export const handleDeleteFile = (path) => {
    fs.unlink(path, (err) => {
        logFile.error(err)
        console.log({ err });
    });
};