import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getAllListings,
  getListing,
  createListing,
  updateListing,
  deleteListing
} from '../controllers/listingController.js';

const router = Router();

// Reading is public; writing requires a logged-in user.
router.get('/', getAllListings);
router.get('/:id', getListing);
router.post('/', requireAuth, createListing);
router.patch('/:id', requireAuth, updateListing);
router.delete('/:id', requireAuth, deleteListing);

export default router;
