const Transfer = require("../models/Transfer");

// ===================================
// Create Transfer Request
// ===================================
exports.createTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.create({
      ...req.body,
      requestedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Transfer request created successfully",
      data: transfer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Get All Transfers
// ===================================
exports.getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find()
      .populate("asset")
      .populate("fromEmployee", "name email")
      .populate("toEmployee", "name email")
      .populate("requestedBy", "name")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transfers.length,
      data: transfers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Get Single Transfer
// ===================================
exports.getTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id)
      .populate("asset")
      .populate("fromEmployee", "name email")
      .populate("toEmployee", "name email");

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Approve Transfer
// ===================================
exports.approveTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer not found",
      });
    }

    transfer.status = "Approved";
    transfer.approvedBy = req.user.id;

    await transfer.save();

    res.status(200).json({
      success: true,
      message: "Transfer approved",
      data: transfer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Reject Transfer
// ===================================
exports.rejectTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer not found",
      });
    }

    transfer.status = "Rejected";
    transfer.approvedBy = req.user.id;

    await transfer.save();

    res.status(200).json({
      success: true,
      message: "Transfer rejected",
      data: transfer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};