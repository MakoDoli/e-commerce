import { Router } from "express";

const router = Router();

router.get("/signin", (req, res) => {
  res.send("Ready to auth");
});

export default router;
