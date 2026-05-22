import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useI18n();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { identifier, password });
      login(response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="form-page auth-page">
      <div className="card auth-card">
        <div style={{ marginBottom: 20 }}>
          <p className="eyebrow">{t('manageLearning')}</p>
          <h1>{t('loginTitle')}</h1>
          <p className="form-note">{t('loginDesc')}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            {t('emailOrUsername')}
            <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} type="text" placeholder={t('emailOrUsername')} required />
          </label>
          <label>
            {t('password')}
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="••••••••" required />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn btn-primary full">
            {t('loginButton')}
          </button>
        </form>
        <p>
          {t('noAccount')} <Link to="/register">{t('registerButton')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
