import {Router} from "express";
const router = Router();

import File from "../models/File.js";

router.get('/', async (req, res) => {
  const files = await File.find(
    {},
    undefined,
    { sort: {uploadedAt: -1} }
  );
  console.debug('debug FILES:', files);
  res.render('files', { title: 'Uploaded Files', files });
})

export default router;
