import { Router } from "express";
import applicationRoutes from "./applications";
import renewalChecklistRoutes from "./renewalChecklists";
import reimbursementRoutes from "./reimbursements";
import fileRoutes from "./files";

const router = Router();

// Mount routes
router.use("/api/applications", applicationRoutes);
router.use("/api/renewal-checklists", renewalChecklistRoutes);
router.use("/api/reimbursements", reimbursementRoutes);
router.use("/api/files", fileRoutes);

export default router;
