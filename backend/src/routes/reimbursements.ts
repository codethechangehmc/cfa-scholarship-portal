import { Router, Request, Response } from "express";
import ReimbursementRequest from "../models/ReimbursementRequest";
import { requireAdmin, requireOwnershipOrAdmin } from '../middleware/auth';

const router = Router();

// POST /api/reimbursements - Create a new reimbursement request
router.post("/", async (req: Request, res: Response) => {
  try {
    const requestData = {
      ...req.body,
      status: "pending",
      submittedAt: new Date(),
    };

    const reimbursement = new ReimbursementRequest(requestData);
    await reimbursement.save();

    res.status(201).json({
      success: true,
      message: "Reimbursement request submitted successfully",
      reimbursementId: reimbursement._id,
      reimbursement,
    });
  } catch (error: any) {
    console.error("Error creating reimbursement request:", error);
    res.status(400).json({
      success: false,
      message: "Failed to submit reimbursement request",
      error: error.message,
    });
  }
});

// GET /api/reimbursements - Get all reimbursement requests (with filters)
// Accessible to: admin
router.get("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      userId,
      applicationId,
      status,
      requestType,
      limit = 50,
      skip = 0,
    } = req.query;

    const filter: any = {};
    if (userId) filter.userId = userId;
    if (applicationId) filter.applicationId = applicationId;
    if (status) filter.status = status;
    if (requestType) filter.requestType = requestType;

    const reimbursements = await ReimbursementRequest.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate("userId", "email profile")
      .populate("applicationId")
      .populate("reviewedBy", "email profile");

    const total = await ReimbursementRequest.countDocuments(filter);

    res.json({
      success: true,
      reimbursements,
      total,
      limit: Number(limit),
      skip: Number(skip),
    });
  } catch (error: any) {
    console.error("Error fetching reimbursement requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reimbursement requests",
      error: error.message,
    });
  }
});

// GET /api/reimbursements/:id - Get a specific reimbursement request
// Accessible to: owner or admin
router.get("/:id", requireOwnershipOrAdmin('userId'), async (req: Request, res: Response) => {
  try {
    const reimbursement = await ReimbursementRequest.findById(req.params.id)
      .populate("userId", "email profile")
      .populate("applicationId")
      .populate("reviewedBy", "email profile");

    if (!reimbursement) {
      return res.status(404).json({
        success: false,
        message: "Reimbursement request not found",
      });
    }

    res.json({
      success: true,
      reimbursement,
    });
  } catch (error: any) {
    console.error("Error fetching reimbursement request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reimbursement request",
      error: error.message,
    });
  }
});

// PATCH /api/reimbursements/:id/status - Update reimbursement status (admin)
// Accessible to: admin only
router.patch("/:id/status", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status, reviewedBy, adminNotes, paidAt } = req.body;

    const updateData: any = {
      status,
      reviewedBy,
      reviewedAt: new Date(),
    };

    if (adminNotes) updateData.adminNotes = adminNotes;
    if (paidAt || status === "paid") updateData.paidAt = paidAt || new Date();

    const reimbursement = await ReimbursementRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!reimbursement) {
      return res.status(404).json({
        success: false,
        message: "Reimbursement request not found",
      });
    }

    res.json({
      success: true,
      message: "Reimbursement status updated",
      reimbursement,
    });
  } catch (error: any) {
    console.error("Error updating reimbursement status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update reimbursement status",
      error: error.message,
    });
  }
});

export default router;
