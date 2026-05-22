import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { getUpcomingTasks, getPendingTasks, getCoursesByUserId } from '../utils/db';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Không tìm thấy người dùng' });
  }

  const schedule = getUpcomingTasks(userId, 10);
  const tasks = getPendingTasks(userId, 10);
  const courses = getCoursesByUserId(userId);
  const progress = courses.length
    ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)
    : 0;

  const upcoming = schedule.map((task) => ({
    id: task.id,
    title: task.title,
    dueDate: task.due_date,
    status: task.status,
    courseId: task.course_id
  }));

  res.json({
    schedule: upcoming,
    tasks,
    progress,
    courses
  });
});

export default router;
