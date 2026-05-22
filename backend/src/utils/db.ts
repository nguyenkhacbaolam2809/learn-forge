import fs from 'fs';
import path from 'path';

const dbPath = path.join(__dirname, '..', '..', 'data.json');

type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  birthYear?: number | null;
  school?: string;
  hometown?: string;
  language?: 'vi' | 'en';
  fontSize?: 'small' | 'medium' | 'large';
};

type Course = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  progress: number;
  created_at: string;
};

type Task = {
  id: number;
  user_id: number;
  title: string;
  due_date: string | null;
  status: string;
  course_id: number | null;
  created_at: string;
};

type DbSchema = {
  users: User[];
  courses: Course[];
  tasks: Task[];
  nextId: {
    users: number;
    courses: number;
    tasks: number;
  };
};

function createEmptyDb(): DbSchema {
  return {
    users: [],
    courses: [],
    tasks: [],
    nextId: {
      users: 1,
      courses: 1,
      tasks: 1
    }
  };
}

function readDb(): DbSchema {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(createEmptyDb(), null, 2), 'utf-8');
  }
  const raw = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(raw) as DbSchema;
}

function writeDb(data: DbSchema) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export function initDb() {
  readDb();
}

export function getUserByEmail(email: string) {
  const db = readDb();
  return db.users.find((user) => user.email === email);
}

export function getUserByEmailOrName(identifier: string) {
  const db = readDb();
  return db.users.find((user) => user.email === identifier || user.name === identifier);
}

export function getUserById(id: number) {
  const db = readDb();
  return db.users.find((user) => user.id === id);
}

export function createUser(name: string, email: string, password_hash: string) {
  const db = readDb();
  const newUser: User = {
    id: db.nextId.users++,
    name,
    email,
    password_hash,
    created_at: new Date().toISOString(),
    birthYear: null,
    school: '',
    hometown: '',
    language: 'vi',
    fontSize: 'medium'
  };
  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export function updateUser(
  id: number,
  payload: Partial<{ name: string; email: string; password_hash: string; birthYear: number | null; school: string; hometown: string; language: 'vi' | 'en'; fontSize: 'small' | 'medium' | 'large' }>
) {
  const db = readDb();
  const user = db.users.find((u) => u.id === id);
  if (!user) return null;
  if (payload.email && payload.email !== user.email) {
    const exists = db.users.find((u) => u.email === payload.email);
    if (exists) return { error: 'email_exists' } as any;
  }
  if (payload.name) user.name = payload.name;
  if (payload.email) user.email = payload.email;
  if (payload.password_hash) user.password_hash = payload.password_hash;
  if (payload.birthYear !== undefined) user.birthYear = payload.birthYear;
  if (payload.school !== undefined) user.school = payload.school;
  if (payload.hometown !== undefined) user.hometown = payload.hometown;
  if (payload.language) user.language = payload.language;
  if (payload.fontSize) user.fontSize = payload.fontSize;
  writeDb(db);
  return user;
}

export function getCoursesByUserId(userId: number) {
  const db = readDb();
  return db.courses.filter((course) => course.user_id === userId);
}

export function createCourse(userId: number, title: string, description: string) {
  const db = readDb();
  const newCourse: Course = {
    id: db.nextId.courses++,
    user_id: userId,
    title,
    description,
    progress: 0,
    created_at: new Date().toISOString()
  };
  db.courses.push(newCourse);
  writeDb(db);
  return newCourse;
}

export function getTasksByUserId(userId: number) {
  const db = readDb();
  return db.tasks.filter((task) => task.user_id === userId);
}

export function createTask(userId: number, title: string, due_date: string | null, course_id: number | null) {
  const db = readDb();
  const newTask: Task = {
    id: db.nextId.tasks++,
    user_id: userId,
    title,
    due_date,
    status: 'pending',
    course_id,
    created_at: new Date().toISOString()
  };
  db.tasks.push(newTask);
  writeDb(db);
  return newTask;
}

export function getTaskByIdAndUserId(id: number, userId: number) {
  const db = readDb();
  return db.tasks.find((task) => task.id === id && task.user_id === userId);
}

export function updateTaskStatus(id: number, status: string) {
  const db = readDb();
  const task = db.tasks.find((task) => task.id === id);
  if (!task) return null;
  task.status = status;
  writeDb(db);
  return task;
}

export function getUpcomingTasks(userId: number, limit = 10) {
  return getTasksByUserId(userId)
    .filter((task) => task.due_date !== null)
    .sort((a, b) => (a.due_date! > b.due_date! ? 1 : -1))
    .slice(0, limit);
}

export function getPendingTasks(userId: number, limit = 10) {
  return getTasksByUserId(userId)
    .filter((task) => task.status !== 'done')
    .sort((a, b) => {
      if (a.due_date === null) return 1;
      if (b.due_date === null) return -1;
      return a.due_date > b.due_date ? 1 : -1;
    })
    .slice(0, limit);
}
