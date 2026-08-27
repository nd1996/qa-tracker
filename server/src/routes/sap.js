const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/sap-webhook (Unauthenticated machine event ingestion)
router.post('/', async (req, res) => {
  try {
    const { equipment_id, defect_category, severity_level, remarks, timestamp } = req.body;

    if (!equipment_id || !defect_category || !severity_level) {
      return res.status(400).json({
        error: 'Invalid SAP payload. Required: equipment_id, defect_category, severity_level'
      });
    }

    // Default attribution to supervisor_a for automated SAP events
    const systemUser = await prisma.user.findFirst({ where: { username: 'supervisor_a' } });

    const newRecord = await prisma.inspection.create({
      data: {
        lineId: equipment_id,
        defectType: defect_category,
        severity: severity_level,
        remarks: remarks ? `[SAP Webhook] ${remarks}` : '[Automated SAP Ingestion]',
        status: 'Open',
        loggedAt: timestamp ? new Date(timestamp) : new Date(),
        loggedById: systemUser ? systemUser.id : 1
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Inspection created from SAP telemetry',
      recordId: newRecord.id
    });
  } catch (err) {
    res.status(500).json({ error: 'SAP Webhook ingestion failed', details: err.message });
  }
});

module.exports = router;
