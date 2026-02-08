import { Router } from "express";
import applicationRoutes from "./applications";
import renewalChecklistRoutes from "./renewalChecklists";
import reimbursementRoutes from "./reimbursements";
import acceptanceFormRoutes from "./acceptanceForms";
import fileRoutes from "./files";
import userRoutes from "./users";
import { ensureAuthenticated } from '../middleware/auth';

const router = Router();

// Mount routes
router.use("/api/applications", applicationRoutes);
router.use("/api/renewal-checklists", renewalChecklistRoutes);
router.use("/api/reimbursements", reimbursementRoutes);
router.use("/api/acceptance-forms", acceptanceFormRoutes);
router.use("/api/files", ensureAuthenticated, fileRoutes);
router.use("/users", userRoutes);

export default router;
