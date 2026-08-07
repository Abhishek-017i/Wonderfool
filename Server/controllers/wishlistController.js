const Wishlist = require("../models/Wishlist");

require("../models/User");
require("../models/Series");

const getUserWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.mongoUser._id }).populate('seriesId', 'title coverImage type');
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching wishlist', error: err.message });
  }
};

const getWishlistByUser = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.params.userId }).populate('seriesId', 'title coverImage type');
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user wishlist', error: err.message });
  }
};

const getWishlistById = async (req, res) => {
  try {
    const item = await Wishlist.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Wishlist item not found' });

    if (item.userId.toString() !== req.mongoUser._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this item' });
    }

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching item', error: err.message });
  }
};

const getWishlistByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const wishlist = await Wishlist.find({ userId: req.mongoUser._id, status }).populate('seriesId', 'title coverImage type');
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching wishlist', error: err.message });
  }
};

const createWishlist = async (req, res) => {
  try {
    const wishlist = new Wishlist({
      ...req.body,
      userId: req.mongoUser._id,   
    });
    const savedWishlist = await wishlist.save();
    res.status(201).json(savedWishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Wishlist not found" });

    if (item.userId.toString() !== req.mongoUser._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this item" });
    }

    const updatedWishlist = await Wishlist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    if (item.userId.toString() !== req.mongoUser._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await Wishlist.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Wishlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWishlistStatus = async (req, res) => {
  try {
    const item = await Wishlist.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    if (item.userId.toString() !== req.mongoUser._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    const { status } = req.body;
    const updateData = { status };

    if (status === "in-progress") {
      updateData.startedDate = new Date();
    }

    if (status === "finished") {
      updateData.finishedDate = new Date();
    }

    const wishlist = await Wishlist.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("userId")
      .populate("seriesId");

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWishlistById,
  getUserWishlist,
  getWishlistByUser,
  getWishlistByStatus,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  updateWishlistStatus,
};

