import { Router } from "express";
import applicationRoutes from "./applications";
import renewalChecklistRoutes from "./renewalChecklists";
import reimbursementRoutes from "./reimbursements";
import fileRoutes from "./files";
import userRoutes from "./users";
import { ensureAuthenticated } from '../middleware/auth';

const router = Router();

// Mount routes
router.use("/api/applications", ensureAuthenticated, applicationRoutes);
router.use("/api/renewal-checklists", ensureAuthenticated, renewalChecklistRoutes);
router.use("/api/reimbursements", ensureAuthenticated, reimbursementRoutes);
router.use("/api/files", ensureAuthenticated, fileRoutes);
router.use("/users", userRoutes);

export default router;
