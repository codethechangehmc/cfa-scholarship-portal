import { Router, Request, Response } from "express";
import RenewalChecklist from "../models/RenewalChecklist";
import { requireAdmin, requireOwnershipOrAdmin } from '../middleware/auth';

const router = Router();

// POST /api/renewal-checklists - Create a new renewal checklist
router.post("/", async (req: Request, res: Response) => {
  try {
    const checklistData = {
      ...req.body,
      status: "submitted",
      submittedAt: new Date(),
    };

    const checklist = new RenewalChecklist(checklistData);
    await checklist.save();

    res.status(201).json({
      success: true,
      message: "Renewal checklist submitted successfully",
      checklistId: checklist._id,
      checklist,
    });
  } catch (error: any) {
    console.error("Error creating renewal checklist:", error);
    res.status(400).json({
      success: false,
      message: "Failed to submit renewal checklist",
      error: error.message,
    });
  }
});

// GET /api/renewal-checklists - Get all renewal checklists (with filters)
// Accessible to: admin
router.get("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      userId,
      applicationId,
      academicYear,
      status,
      limit = 50,
      skip = 0,
    } = req.query;

    const filter: any = {};
    if (userId) filter.userId = userId;
    if (applicationId) filter.applicationId = applicationId;
    if (academicYear) filter.academicYear = academicYear;
    if (status) filter.status = status;

    const checklists = await RenewalChecklist.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate("userId", "email profile")
      .populate("applicationId")
      .populate("reviewedBy", "email profile");

    const total = await RenewalChecklist.countDocuments(filter);

    res.json({
      success: true,
      checklists,
      total,
      limit: Number(limit),
      skip: Number(skip),
    });
  } catch (error: any) {
    console.error("Error fetching renewal checklists:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch renewal checklists",
      error: error.message,
    });
  }
});

// GET /api/renewal-checklists/:id - Get a specific renewal checklist
// Accessible to: owner or admin
router.get("/:id", requireOwnershipOrAdmin('userId'),  async (req: Request, res: Response) => {
  try {
    const checklist = await RenewalChecklist.findById(req.params.id)
      .populate("userId", "email profile")
      .populate("applicationId")
      .populate("reviewedBy", "email profile");

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: "Renewal checklist not found",
      });
    }

    res.json({
      success: true,
      checklist,
    });
  } catch (error: any) {
    console.error("Error fetching renewal checklist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch renewal checklist",
      error: error.message,
    });
  }
});

// PATCH /api/renewal-checklists/:id/review - Review a renewal checklist (admin)
// Accessible to: admin only
router.patch("/:id/review", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { reviewedBy, adminNotes, status } = req.body;

    const checklist = await RenewalChecklist.findByIdAndUpdate(
      req.params.id,
      {
        status: status || "reviewed",
        reviewedBy,
        reviewedAt: new Date(),
        adminNotes,
      },
      { new: true }
    );

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: "Renewal checklist not found",
      });
    }

    res.json({
      success: true,
      message: "Renewal checklist reviewed",
      checklist,
    });
  } catch (error: any) {
    console.error("Error reviewing renewal checklist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to review renewal checklist",
      error: error.message,
    });
  }
});

export default router;
