const Department = require("../models/Department");

// ================================
// Create Department
// ================================
exports.createDepartment = async (req, res) => {
  try {
    const { name, description, departmentHead } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    const existingDepartment = await Department.findOne({
      name: name.trim(),
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: "Department already exists",
      });
    }

    const department = await Department.create({
      name: name.trim(),
      description,
      departmentHead,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Get All Departments
// ================================
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Get Single Department
// ================================
exports.getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Update Department
// ================================
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    if (req.body.name) {
      const duplicate = await Department.findOne({
        name: req.body.name.trim(),
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Department name already exists",
        });
      }

      department.name = req.body.name.trim();
    }

    if (req.body.description !== undefined)
      department.description = req.body.description;

    if (req.body.departmentHead !== undefined)
      department.departmentHead = req.body.departmentHead;

    if (req.body.status !== undefined)
      department.status = req.body.status;

    await department.save();

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Soft Delete Department
// ================================
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    department.status = "Inactive";

    await department.save();

    return res.status(200).json({
      success: true,
      message: "Department deactivated successfully",
      data: department,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};