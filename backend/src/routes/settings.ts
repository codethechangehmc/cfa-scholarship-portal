import { Router, Request, Response } from "express";
import SiteSettings from "../models/SiteSettings";
import { ensureAuthenticated, requireAdmin } from "../middleware/auth";

const router = Router();

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({ schoolYear: "2025-2026", deadline: "June 1st, 2025" });
  }
  return settings;
}

// GET /api/settings — public
router.get("/", async (_req: Request, res: Response) => {
  try {
    const settings = await getOrCreateSettings();
    return res.json({ schoolYear: settings.schoolYear, deadline: settings.deadline });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching settings" });
  }
});

// PUT /api/settings — admin only
router.put("/", ensureAuthenticated, requireAdmin, async (req: Request, res: Response) => {
  const { schoolYear, deadline } = req.body;
  if (!schoolYear || !deadline) {
    return res.status(400).json({ message: "schoolYear and deadline are required" });
  }
  try {
    const settings = await getOrCreateSettings();
    settings.schoolYear = schoolYear;
    settings.deadline = deadline;
    await settings.save();
    return res.json({ schoolYear: settings.schoolYear, deadline: settings.deadline });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating settings" });
  }
});

export default router;
