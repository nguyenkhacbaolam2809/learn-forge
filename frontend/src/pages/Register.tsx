import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useI18n();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/register', { name, email, password });
      login(response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="form-page auth-page">
      <div className="card auth-card">
        <div style={{ marginBottom: 20 }}>
          <p className="eyebrow">{t('registerDesc')}</p>
          <h1>{t('registerTitle')}</h1>
          <p className="form-note">{t('registerDesc')}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            {t('name')}
            <input value={name} onChange={(event) => setName(event.target.value)} type="text" placeholder="Nguyễn Văn A" required />
          </label>
          <label>
            {t('email')}
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="name@example.com" required />
          </label>
          <label>
            {t('password')}
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="••••••••" required />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn btn-primary full">
            {t('registerButton')}
          </button>
        </form>
        <p>
          {t('haveAccount')} <Link to="/login">{t('loginButton')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
