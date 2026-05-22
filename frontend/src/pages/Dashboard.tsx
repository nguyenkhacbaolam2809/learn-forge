import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import ScheduleWidget from '../components/ScheduleWidget';
import TaskList from '../components/TaskList';
import ProgressOverview from '../components/ProgressOverview';
import ChatBox from '../components/ChatBox';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import CTASection from '../components/CTASection';
import FeaturesSection from '../components/FeaturesSection';
import Sidebar from '../components/Sidebar';
import Courses from './Courses';
import Tasks from './Tasks';
import Schedule from './Schedule';
import { ScheduleItem } from '../types';

function Dashboard() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [tasks, setTasks] = useState<ScheduleItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [courses, setCourses] = useState<{ id: number; title: string; progress: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const activeTab = location.pathname.endsWith('/progress')
    ? 'progress'
    : location.pathname.endsWith('/tasks')
    ? 'tasks'
    : location.pathname.endsWith('/schedule')
    ? 'schedule'
    : location.pathname.endsWith('/chat')
    ? 'chat'
    : 'courses';

  const courseCount = courses.length;
  const pendingTasks = tasks.filter((item) => item.status !== 'done').length;
  const upcomingEvents = schedule.length;

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setSchedule(response.data.schedule);
        setTasks(response.data.tasks);
        setProgress(response.data.progress);
        setCourses(response.data.courses);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goSettings = () => navigate('/settings');

  return (
    <div className="app-shell">
      <header className="topbar-full">
        <div className="topbar-content">
          <div className="topbar-left">
            <div className="logo">VNOI Wiki</div>
          </div>

          <div className="topbar-center">
            <SearchBar courses={courses} tasks={tasks} schedule={schedule} />
          </div>

          <div className="topbar-right">
            <button className="icon-btn" title="Tags">🏷️</button>
            <button className="icon-btn" title="Theme">🌓</button>
            <button className="icon-btn" title="Profile">👤</button>
          </div>
        </div>
      </header>

      <main className="dashboard-page">
        <HeroSection courseCount={courseCount} pendingTasks={pendingTasks} upcomingEvents={upcomingEvents} />

        <div className="dashboard-layout">
          <aside className="sidebar-col">
            <Sidebar />
          </aside>

          <section className="main-col">
            <div className="dashboard-tabs">
              <button className={activeTab === 'courses' ? 'tab active' : 'tab'} onClick={() => navigate('courses')}>
                {t('coursesTab')}
              </button>
              <button className={activeTab === 'progress' ? 'tab active' : 'tab'} onClick={() => navigate('progress')}>
                {t('progressTab')}
              </button>
              <button className={activeTab === 'tasks' ? 'tab active' : 'tab'} onClick={() => navigate('tasks')}>
                {t('tasksTab')}
              </button>
              <button className={activeTab === 'schedule' ? 'tab active' : 'tab'} onClick={() => navigate('schedule')}>
                {t('scheduleTab')}
              </button>
              <button className={activeTab === 'chat' ? 'tab active' : 'tab'} onClick={() => navigate('chat')}>
                {t('chatTab')}
              </button>
            </div>

            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <Routes>
                <Route index element={<div className="dashboard-grid"><ProgressOverview progress={progress} courses={courses} /><ScheduleWidget items={schedule} /><TaskList items={tasks} /></div>} />
                <Route path="courses" element={<Courses />} />
                <Route path="progress" element={<div className="dashboard-grid"><ProgressOverview progress={progress} courses={courses} /><TaskList items={tasks} /></div>} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="schedule" element={<div className="dashboard-grid"><Schedule /><TaskList items={tasks} /></div>} />
                <Route path="chat" element={<div className="dashboard-grid"><ChatBox /></div>} />
              </Routes>
            )}
          </section>
        </div>

        <FeaturesSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
