const express = require('express');
const router = express.Router();
const Timeline = require('../models/Timeline');
const verifyToken = require('../middleware/verifyToken');

// POST /api/timeline
// Add a series to the timeline
router.post('/', verifyToken, async (req, res) => {
  try {
    const { seriesId, actionType, note } = req.body;
    const userId = req.mongoUser._id;

    if (!seriesId) {
      return res.status(400).json({ message: 'seriesId is required' });
    }

    const newTimelineEntry = new Timeline({
      userId,
      seriesId,
      actionType: actionType || 'started',
      note: note || ''
    });

    await newTimelineEntry.save();
    res.status(201).json(newTimelineEntry);
  } catch (error) {
    console.error('Error adding to timeline:', error);
    res.status(500).json({ message: 'Failed to add to timeline' });
  }
});

// GET /api/timeline
// Get the user's timeline
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.mongoUser._id;

    // Find all timeline entries for the user, sort by newest first, and populate the series details
    const timelineEvents = await Timeline.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'seriesId',
        select: 'title coverImage type status episodeCount chapterCount'
      });

    res.status(200).json(timelineEvents);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({ message: 'Failed to fetch timeline' });
  }
});

// DELETE /api/timeline/:id
// Remove a timeline entry
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.mongoUser._id;

    const deletedEntry = await Timeline.findOneAndDelete({ _id: id, userId });

    if (!deletedEntry) {
      return res.status(404).json({ message: 'Timeline entry not found' });
    }

    res.status(200).json({ message: 'Timeline entry removed successfully' });
  } catch (error) {
    console.error('Error removing from timeline:', error);
    res.status(500).json({ message: 'Failed to remove from timeline' });
  }
});

// PUT /api/timeline/:id
// Update a timeline entry
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType, note, progress } = req.body;
    const userId = req.mongoUser._id;

    const updatedEntry = await Timeline.findOneAndUpdate(
      { _id: id, userId },
      { $set: { actionType, note, progress } },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: 'Timeline entry not found' });
    }

    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error('Error updating timeline:', error);
    res.status(500).json({ message: 'Failed to update timeline' });
  }
});

module.exports = router;
