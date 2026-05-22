export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ScheduleItem {
  id: number;
  title: string;
  dueDate: string | null;
  status: string;
  courseId?: number | null;
}

export interface ProgressData {
  progress: number;
  courses: { id: number; title: string; progress: number }[];
}
