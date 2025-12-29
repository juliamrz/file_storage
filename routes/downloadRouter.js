import {Router} from "express";
import fs from "fs";
import {unlink} from "fs/promises";
import unzipper from "unzipper";
import File from "../models/File.js";
import path from "path";

const router = Router();

router.get("/:fileId", async (req, res) => {
  const { fileId } = req.params;
  const file = await File.findOne({_id: fileId});
  if (!file) {
    res.status(404);
    return;
  }

  const zipFilePath = path.join('storage', file.filename);
  const unzipFilePath = path.join('storage', 'temp');
  fs.createReadStream(zipFilePath)
    .pipe(unzipper.Extract({ path: unzipFilePath }))
    .on('close', () => {
      const filePath = path.join(unzipFilePath, file.originalName);
      res.download(filePath, async (err) => {
        if (err) {
          res.status(404).send('File not found');
          return;
        }

        try {
          await unlink(path.join(unzipFilePath, file.originalName));
        } catch (err) {
          res.status(404).send('File not found');
        }
      });
      res.status(200);
  });
})

export default router;
