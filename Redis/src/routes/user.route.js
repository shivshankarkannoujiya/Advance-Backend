import { Router } from 'express';
import {
    deleteUser,
    getAllUser,
    getUser,
    registerUser,
    updateUser,
} from '../controllers/user.controller.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/:id').get(getUser);
router.route('/all').get(getAllUser);
router.route('/update/:id').put(updateUser);
router.route('/delete/:id').put(deleteUser);

export default router;
