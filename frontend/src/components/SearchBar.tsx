import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import { ScheduleItem } from '../types';

interface Course {
  id: number;
  title: string;
  progress?: number;
}

interface Props {
  courses?: Course[];
  tasks?: ScheduleItem[];
  schedule?: ScheduleItem[];
}

export default function SearchBar({ courses = [], tasks = [], schedule = [] }: Props) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { courses: [], tasks: [], schedule: [] };

    return {
      courses: courses.filter((c) => c.title.toLowerCase().includes(q)).slice(0, 5),
      tasks: tasks.filter((s) => s.title.toLowerCase().includes(q)).slice(0, 5),
      schedule: schedule.filter((s) => s.title.toLowerCase().includes(q)).slice(0, 5)
    };
  }, [query, courses, tasks, schedule]);

  useEffect(() => {
    if (!query) return;
    const id = setTimeout(() => {
      // nothing to do — memoized results update automatically
    }, 200);
    return () => clearTimeout(id);
  }, [query]);

  const handleClickCourse = (id: number) => {
    navigate('courses');
    setQuery('');
  };

  const handleClickTask = () => {
    navigate('tasks');
    setQuery('');
  };

  return (
    <div className="searchbar">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="search-input"
      />

      {query && (
        <div className="search-results card">
          <h4>{t('searchResultsTitle')}</h4>

          {results.courses.length === 0 && results.tasks.length === 0 && results.schedule.length === 0 ? (
            <p>{t('searchNoResults')}</p>
          ) : (
            <div className="results-list">
              {results.courses.map((c) => (
                <div key={`c-${c.id}`} className="result-item" onClick={() => handleClickCourse(c.id)}>
                  <strong>{c.title}</strong>
                  <span className="muted">{t('coursesTab')}</span>
                </div>
              ))}

              {results.tasks.map((titem) => (
                <div key={`t-${titem.id}`} className="result-item" onClick={handleClickTask}>
                  <strong>{titem.title}</strong>
                  <span className="muted">{t('tasksTab')}</span>
                </div>
              ))}

              {results.schedule.map((sitem) => (
                <div key={`s-${sitem.id}`} className="result-item" onClick={() => navigate('schedule')}>
                  <strong>{sitem.title}</strong>
                  <span className="muted">{t('scheduleTab')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
