const express = require("express");

const router = express.Router();

const {
  getEmployees,
  getEmployee,
  updateEmployee,
  deactivateEmployee,
} = require("../controllers/employeeController");

const { requireAuth, requireRole } = require("../middleware/auth");

router.use(requireAuth);

router.get("/", requireRole("admin", "manager"), getEmployees);

router.get("/:id", requireRole("admin", "manager"), getEmployee);

router.put("/:id", requireRole("admin"), updateEmployee);

router.delete("/:id", requireRole("admin"), deactivateEmployee);

module.exports = router;