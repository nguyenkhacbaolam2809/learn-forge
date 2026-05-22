import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail, getUserByEmailOrName, getUserById, updateUser } from '../utils/db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email đã được sử dụng' });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const user = createUser(name, email, password_hash);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '1d'
  });

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      birthYear: user.birthYear,
      school: user.school,
      hometown: user.hometown,
      language: user.language,
      fontSize: user.fontSize
    },
    token
  });
});

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or username
  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier và mật khẩu là bắt buộc' });
  }

  const user = getUserByEmailOrName(identifier);
  if (!user) {
    return res.status(400).json({ message: 'Tài khoản không tồn tại' });
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ message: 'Mật khẩu không chính xác' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '1d'
  });

  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

// Get current user profile
router.get('/me', authenticateToken, (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const user = getUserById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    birthYear: user.birthYear,
    school: user.school,
    hometown: user.hometown,
    language: user.language,
    fontSize: user.fontSize
  });
});

// Update profile
router.put('/me', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const { name, email, password, oldPassword, birthYear, school, hometown, language, fontSize } = req.body;
  const payload: any = {};
  // If changing email or password, require oldPassword
  if ((email || password) && !oldPassword) {
    return res.status(400).json({ message: 'Cần mật khẩu cũ để thay đổi email hoặc mật khẩu' });
  }
  const existing = getUserById(userId);
  if (!existing) return res.status(404).json({ message: 'User not found' });
  if (oldPassword && (email || password)) {
    const ok = await bcrypt.compare(oldPassword, existing.password_hash);
    if (!ok) return res.status(401).json({ message: 'Mật khẩu cũ không đúng' });
  }
  if (name !== undefined) payload.name = name;
  if (email !== undefined) payload.email = email;
  if (password) payload.password_hash = await bcrypt.hash(password, 10);
  if (birthYear !== undefined) payload.birthYear = birthYear;
  if (school !== undefined) payload.school = school;
  if (hometown !== undefined) payload.hometown = hometown;
  if (language !== undefined) payload.language = language;
  if (fontSize !== undefined) payload.fontSize = fontSize;

  const result = updateUser(userId, payload);
  if (!result) return res.status(404).json({ message: 'User not found' });
  if ((result as any).error === 'email_exists') return res.status(400).json({ message: 'Email đã tồn tại' });
  res.json({
    id: result.id,
    name: result.name,
    email: result.email,
    birthYear: result.birthYear,
    school: result.school,
    hometown: result.hometown,
    language: result.language,
    fontSize: result.fontSize
  });
});

// Delete account
router.delete('/me', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const { password } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!password) return res.status(400).json({ message: 'Cần mật khẩu để xóa tài khoản' });
  const user = getUserById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Mật khẩu không đúng' });
  const deleted = deleteUser(userId);
  if (!deleted) return res.status(500).json({ message: 'Không thể xóa tài khoản' });
  res.json({ message: 'Tài khoản đã được xóa' });
});

export default router;
