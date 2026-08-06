const Review = require('../models/Review');


const getReviewsBySeries = async (req, res) => {
  try {
    const { sortBy = "mostRecent" } = req.query;

    let sortOption = { createdAt: -1 }; 
    if (sortBy === "highestRating") sortOption = { rating: -1 };
    if (sortBy === "lowestRating") sortOption = { rating: 1 };

    let reviews = await Review.find({ seriesId: req.params.seriesId })
      .populate("userId", "name avatar")
      .sort(sortOption);

    if (sortBy === "mostLiked") {
      reviews = reviews.sort((a, b) => b.likes.length - a.likes.length);
    }

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
};


const createReview = async (req, res) => {
  try {
    const { seriesId, rating, text } = req.body;
    const review = await Review.create({
      seriesId,
      rating,
      text,
      userId: req.mongoUser._id ,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: 'Error creating review', error: err.message });
  }
};


const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.userId.toString() !== req.mongoUser._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating review', error: err.message });
  }
};


const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.userId.toString() !== req.mongoUser._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review', error: err.message });
  }
};


const toggleLikeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const userId = req.mongoUser._id;
     
    const alreadyLiked = review.likes.includes(userId);

    if (alreadyLiked) {
      review.likes.pull(userId);
    } else {
      review.likes.push(userId);
    }

    await review.save();
    res.status(200).json({ likes: review.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ message: 'Error toggling like', error: err.message });
  }
};



module.exports = {
  getReviewsBySeries,
  createReview,
  updateReview,
  deleteReview,
  toggleLikeReview,
};