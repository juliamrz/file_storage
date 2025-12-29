import {Router} from "express";
const router = Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'File Upload',
    message: null,
    error: null
  });
})

export default router;
