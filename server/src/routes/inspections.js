const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/inspections (Filterable, sortable list with audit trails and pagination)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      severity, 
      status, 
      defectType, 
      lineId, 
      fromDate, 
      toDate, 
      sort = 'desc',
      page = '1',
      limit = '10'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * pageSize;

    const where = {};

    if (severity) where.severity = severity;
    if (status) where.status = status;
    if (defectType) where.defectType = defectType;
    if (lineId) where.lineId = { contains: lineId };

    if (fromDate || toDate) {
      where.loggedAt = {};
      if (fromDate) where.loggedAt.gte = new Date(fromDate);
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        where.loggedAt.lte = end;
      }
    }

    // Execute query and total count in parallel
    const [totalRecords, inspections] = await Promise.all([
      prisma.inspection.count({ where }),
      prisma.inspection.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { loggedAt: sort.toLowerCase() === 'asc' ? 'asc' : 'desc' },
        include: {
          loggedBy: { select: { id: true, username: true, shift: true } },
          resolvedBy: { select: { id: true, username: true, shift: true } }
        }
      })
    ]);

    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      data: inspections,
      pagination: {
        page: pageNum,
        limit: pageSize,
        totalRecords,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve inspections', details: err.message });
  }
});

// GET /api/inspections/summary (Count Open and Resolved by severity)
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const summaryRaw = await prisma.inspection.groupBy({
      by: ['status', 'severity'],
      _count: { id: true }
    });

    const summary = {
      open: { Critical: 0, Major: 0, Minor: 0, total: 0 },
      resolved: { Critical: 0, Major: 0, Minor: 0, total: 0 }
    };

    summaryRaw.forEach((row) => {
      const bucket = row.status.toLowerCase() === 'open' ? 'open' : 'resolved';
      if (summary[bucket][row.severity] !== undefined) {
        summary[bucket][row.severity] = row._count.id;
        summary[bucket].total += row._count.id;
      }
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate summary', details: err.message });
  }
});

// POST /api/inspections (Log a new inspection)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { lineId, defectType, severity, remarks, loggedAt } = req.body;

    if (!lineId || !defectType || !severity) {
      return res.status(400).json({ error: 'lineId, defectType, and severity are required.' });
    }

    const inspection = await prisma.inspection.create({
      data: {
        lineId,
        defectType,
        severity,
        remarks: remarks || null,
        status: 'Open',
        loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
        loggedById: req.user.id
      },
      include: {
        loggedBy: { select: { id: true, username: true, shift: true } }
      }
    });

    res.status(201).json(inspection);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create inspection', details: err.message });
  }
});

// PATCH /api/inspections/:id/resolve (Resolve with mandatory note)
router.patch('/:id/resolve', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { resolutionNote } = req.body;

    if (!resolutionNote || !resolutionNote.trim()) {
      return res.status(400).json({ error: 'A mandatory resolution note is required.' });
    }

    const updated = await prisma.inspection.update({
      where: { id },
      data: {
        status: 'Resolved',
        resolutionNote: resolutionNote.trim(),
        resolvedAt: new Date(),
        resolvedById: req.user.id
      },
      include: {
        loggedBy: { select: { id: true, username: true, shift: true } },
        resolvedBy: { select: { id: true, username: true, shift: true } }
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve inspection', details: err.message });
  }
});

module.exports = router;
