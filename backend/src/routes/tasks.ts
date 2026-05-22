import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createTask, getTasksByUserId, getTaskByIdAndUserId, updateTaskStatus } from '../utils/db';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const tasks = getTasksByUserId(userId!);
  res.json({ tasks });
});

router.post('/', authenticateToken, (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const { title, due_date, course_id } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Tiêu đề task là bắt buộc' });
  }
  const task = createTask(userId!, title, due_date || null, course_id || null);
  res.json({ task });
});

router.patch('/:id', authenticateToken, (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'done'].includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }
  const row = getTaskByIdAndUserId(Number(id), userId!);
  if (!row) {
    return res.status(404).json({ message: 'Task không tồn tại' });
  }
  updateTaskStatus(Number(id), status);
  res.json({ message: 'Cập nhật thành công' });
});

export default router;
