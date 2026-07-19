const express = require("express");
const router = express.Router();

const {
  getAllWishlists,
  getWishlistById,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  getWishlistsByUser,
  getWishlistsByUserAndStatus,
  updateWishlistStatus, 
} = require("../controllers/wishlistController");

router.get("/", getAllWishlists);
router.get("/user/:userId/status/:status", getWishlistsByUserAndStatus);
router.get("/user/:userId", getWishlistsByUser);
router.get("/:id", getWishlistById);
router.post("/", createWishlist);
router.patch("/status/:id", updateWishlistStatus);
router.put("/:id", updateWishlist);
router.delete("/:id", deleteWishlist);

module.exports = router;