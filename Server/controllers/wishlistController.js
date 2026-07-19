const Wishlist = require("../models/Wishlist");

require("../models/User");
require("../models/Series");

const getAllWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find()
      .populate("userId")
      .populate("seriesId");

    res.status(200).json(wishlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWishlistById = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id)
      .populate("userId")
      .populate("seriesId");

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWishlist = async (req, res) => {
  try {
    const wishlist = new Wishlist(req.body);

    const savedWishlist = await wishlist.save();

    res.status(201).json(savedWishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWishlist = async (req, res) => {
  try {
    const updatedWishlist = await Wishlist.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedWishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    res.status(200).json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteWishlist = async (req, res) => {
  try {
    const deletedWishlist = await Wishlist.findByIdAndDelete(req.params.id);

    if (!deletedWishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    res.status(200).json({
      message: "Wishlist deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWishlistsByUser = async (req, res) => {
  try {
    const wishlists = await Wishlist.find({
      userId: req.params.userId,
    })
      .populate("userId")
      .populate("seriesId");

    res.status(200).json(wishlists);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWishlistsByUserAndStatus = async (req, res) => {
  try {
    const { userId, status } = req.params;

    const wishlists = await Wishlist.find({
      userId,
      status,
    })
      .populate("userId")
      .populate("seriesId");

    res.status(200).json(wishlists);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateWishlistStatus = async (req, res) => {
  try {
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
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("userId")
      .populate("seriesId");

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllWishlists,
  getWishlistById,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  getWishlistsByUser,
  getWishlistsByUserAndStatus,
  updateWishlistStatus,
};