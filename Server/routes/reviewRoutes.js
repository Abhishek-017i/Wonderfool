const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const {
  getReviewsBySeries,
  getReviewsByUser,
  createReview,
  updateReview,
  deleteReview,
  toggleLikeReview,
} = require('../controllers/reviewController');

router.get('/series/:seriesId', getReviewsBySeries);
router.get('/user/:userId', getReviewsByUser);

router.post('/', verifyToken, createReview);
router.put('/:id', verifyToken, updateReview);
router.delete('/:id', verifyToken, deleteReview);
router.post('/:id/like', verifyToken, toggleLikeReview);

module.exports = router;