import { create } from 'zustand';
import api from '../lib/api';

const useWishlistStore = create((set, get) => ({
  items: [],
  wishlistIds: new Set(),
  loaded: false,

  fetchWishlist: async () => {
    const res = await api.get('/wishlists');
    const ids = new Set(res.data.map((item) => item.seriesId._id));
    set({ items: res.data, wishlistIds: ids, loaded: true });
  },

  isWishlisted: (seriesId) => get().wishlistIds.has(seriesId),

  toggleWishlist: async (seriesId, seriesData) => {
    const isCurrentlyIn = get().wishlistIds.has(seriesId);
    const existingItem = get().items.find((item) => item.seriesId._id === seriesId);

    set((state) => {
      const newIds = new Set(state.wishlistIds);
      let newItems = [...state.items];
      if (isCurrentlyIn) {
        newIds.delete(seriesId);
        newItems = newItems.filter((item) => item.seriesId._id !== seriesId);
      } else {
        newIds.add(seriesId);
        if (seriesData) {
          newItems.push({
            _id: `temp-${seriesId}`, 
            status: 'planning',
            seriesId: { _id: seriesId, ...seriesData },
          });
        }
      }
      return { wishlistIds: newIds, items: newItems };
    });

    try {
      if (isCurrentlyIn) {
        if (!existingItem) throw new Error('Wishlist item not found locally');
        await api.delete(`/wishlists/${existingItem._id}`);
      } else {
        await api.post('/wishlists', { seriesId });
        // resync to replace the temp item with the real one (real _id, populated fields)
        await get().fetchWishlist();
      }
    } catch (err) {
      await get().fetchWishlist(); // rollback by resyncing from server
      console.error('Wishlist toggle failed:', err);
    }
  },

  updateStatus: async (wishlistId, status) => {
    const prevItems = get().items;
    // optimistic update
    set((state) => ({
      items: state.items.map((item) =>
        item._id === wishlistId ? { ...item, status } : item
      ),
    }));

    try {
      const res = await api.patch(`/wishlists/status/${wishlistId}`, { status });
      set((state) => ({
        items: state.items.map((item) =>
          item._id === wishlistId ? res.data : item
        ),
      }));
    } catch (err) {
      set({ items: prevItems }); // rollback
      console.error('Wishlist status update failed:', err);
    }
  },
}));

export default useWishlistStore;