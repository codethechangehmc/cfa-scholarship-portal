import { Router, Request, Response } from "express";
import AcceptanceForm from "../models/AcceptanceForm";

const router = Router();

// POST /api/acceptance-forms - Create a new acceptance form
router.post("/", async (req: Request, res: Response) => {
  try {
    const formData = {
      ...req.body,
      acceptedAt: new Date(),
    };

    const form = new AcceptanceForm(formData);
    await form.save();

    res.status(201).json({
      success: true,
      message: "Acceptance form submitted successfully",
      formId: form._id,
      form,
    });
  } catch (error: any) {
    console.error("Error creating acceptance form:", error);
    res.status(400).json({
      success: false,
      message: "Failed to submit acceptance form",
      error: error.message,
    });
  }
});

// GET /api/acceptance-forms - Get all acceptance forms
router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId, applicationId, limit = 50, skip = 0 } = req.query;

    const filter: any = {};
    if (userId) filter.userId = userId;
    if (applicationId) filter.applicationId = applicationId;

    const forms = await AcceptanceForm.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate("userId", "email profile")
      .populate("applicationId");

    const total = await AcceptanceForm.countDocuments(filter);

    res.json({
      success: true,
      forms,
      total,
      limit: Number(limit),
      skip: Number(skip),
    });
  } catch (error: any) {
    console.error("Error fetching acceptance forms:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch acceptance forms",
      error: error.message,
    });
  }
});

// GET /api/acceptance-forms/:id - Get a specific acceptance form
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const form = await AcceptanceForm.findById(req.params.id)
      .populate("userId", "email profile")
      .populate("applicationId");

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Acceptance form not found",
      });
    }

    res.json({
      success: true,
      form,
    });
  } catch (error: any) {
    console.error("Error fetching acceptance form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch acceptance form",
      error: error.message,
    });
  }
});

export default router;
