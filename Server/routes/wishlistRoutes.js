const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const {

  getWishlistById,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  getUserWishlist,
  getWishlistByStatus,
  updateWishlistStatus,
   
} = require("../controllers/wishlistController");
router.get("/", verifyToken, getUserWishlist);
router.get("/:id",verifyToken ,getWishlistById);
router.post("/", verifyToken, createWishlist);
router.patch("/status/:id", verifyToken, updateWishlistStatus);
router.put("/:id", verifyToken, updateWishlist);
router.delete("/:id", verifyToken, deleteWishlist);
router.get("/status/:status", verifyToken, getWishlistByStatus);

module.exports = router;
