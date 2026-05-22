import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../hooks/useI18n';

function Settings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthYear, setBirthYear] = useState<number | ''>('');
  const [school, setSchool] = useState('');
  const [hometown, setHometown] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useAuth();
  const { theme, setTheme, language, setLanguage, fontSize, setFontSize } = useTheme();
  const { t } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/auth/me');
        setName(res.data.name);
        setEmail(res.data.email);
        setBirthYear(res.data.birthYear ?? '');
        setSchool(res.data.school ?? '');
        setHometown(res.data.hometown ?? '');
        if (res.data.language) setLanguage(res.data.language);
        if (res.data.fontSize) setFontSize(res.data.fontSize);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) load();
  }, [token, setLanguage, setFontSize]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const payload: any = {
        name,
        email,
        birthYear: birthYear || null,
        school,
        hometown,
        language,
        fontSize
      };
      if (password) payload.password = password;
      if ((password || email) && !oldPassword) {
        setMessage('Cần mật khẩu cũ để thay đổi email hoặc mật khẩu');
        return;
      }
      if (oldPassword) payload.oldPassword = oldPassword;
      await api.put('/auth/me', payload);
      setMessage('Cập nhật thành công');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Cài đặt cá nhân</p>
          <h1>Thông tin tài khoản</h1>
          <p className="form-note">Cập nhật hồ sơ, bảo mật và cấu hình cá nhân 1 cách chuyên nghiệp.</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>
          Quay lại Dashboard
        </button>
      </div>

      <div className="settings-grid">
        <div className="card form-card">
          <div className="section-header">
            <div>
              <h2>{t('profileHeader')}</h2>
              <p>{t('profileSubtext')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Họ và tên
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" required />
              </label>
              <label>
                Email
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </label>
              <label>
                Năm sinh
                <input value={birthYear as any} onChange={(e) => setBirthYear(e.target.value ? Number(e.target.value) : '')} type="number" min="1900" max="2100" />
              </label>
              <label>
                Trường học
                <input value={school} onChange={(e) => setSchool(e.target.value)} type="text" />
              </label>
              <label>
                Quê quán
                <input value={hometown} onChange={(e) => setHometown(e.target.value)} type="text" />
              </label>
            </div>

            <div className="section-divider" />

            <div className="section-header">
              <div>
                <h2>{t('securityHeader')}</h2>
                <p>{t('securitySubtext')}</p>
              </div>
            </div>

            <div className="form-grid">
              <label>
                Mật khẩu mới
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Để trống nếu không đổi" />
              </label>
              <label>
                Mật khẩu cũ
                <input value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} type="password" placeholder="Yêu cầu khi đổi bảo mật" />
              </label>
            </div>

            <div className="section-divider" />

            <div className="section-header">
              <div>
                <h2>{t('displayHeader')}</h2>
                <p>{t('displaySubtext')}</p>
              </div>
            </div>

            <div className="form-grid">
              <label>
                {t('theme')}
                <select value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
                  <option value="light">{t('light')}</option>
                  <option value="dark">{t('dark')}</option>
                </select>
              </label>
              <label>
                {t('language')}
                <select value={language} onChange={(e) => setLanguage(e.target.value as 'vi' | 'en')}>
                  <option value="vi">{t('vietnamese')}</option>
                  <option value="en">{t('english')}</option>
                </select>
              </label>
              <label>
                {t('fontSize')}
                <select value={fontSize} onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}>
                  <option value="small">{t('small')}</option>
                  <option value="medium">{t('medium')}</option>
                  <option value="large">{t('large')}</option>
                </select>
              </label>
            </div>

            <div className="settings-actions">
              <button type="submit" className="btn btn-primary full">
                {t('saveChanges')}
              </button>
              <button
                type="button"
                className="btn btn-danger full"
                onClick={async () => {
                  const confirmPassword = window.prompt('Nhập mật khẩu để xác nhận xóa tài khoản');
                  if (!confirmPassword) return;
                  try {
                    await api.delete('/auth/me', { data: { password: confirmPassword } });
                    alert('Tài khoản đã bị xóa.');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  } catch (err: any) {
                    alert(err.response?.data?.message || 'Xóa tài khoản thất bại');
                  }
                }}
              >
                Xóa tài khoản
              </button>
            </div>
          </form>

          {message && <p className="info">{message}</p>}
        </div>

        <aside className="card summary-card">
          <div className="section-header">
            <div>
              <h2>Gợi ý cấu hình</h2>
              <p>Giữ hồ sơ sạch và bảo mật vững chắc để hệ thống hỗ trợ tốt nhất.</p>
            </div>
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Tên hiện tại</span>
              <strong>{name || 'Chưa cập nhật'}</strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Email đăng nhập</span>
              <strong>{email || 'Không có'}</strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Thông tin đầy đủ</span>
              <strong>{birthYear ? `${birthYear}` : 'Chưa cấu hình'}</strong>
            </div>
          </div>
          <button type="button" className="btn btn-outline full" onClick={() => navigate('/dashboard')}>
            {t('backToDashboard')}
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Settings;
