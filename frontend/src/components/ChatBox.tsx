import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../hooks/useI18n';

type Msg = { id: number; user_id: number; text: string; created_at: string };

export default function ChatBox() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 5000);
    return () => clearInterval(iv);
  }, []);

  const send = async () => {
    if (!text.trim()) return;
    try {
      await api.post('/messages', { text });
      setText('');
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="card widget">
      <div className="widget-header">
        <h2>{t('chatTitle')}</h2>
      </div>
      <div className="chat-list">
        {messages.map((m) => (
          <div key={m.id} className="chat-item">
            <span className="timestamp">{new Date(m.created_at).toLocaleString()}</span>
            <p>{m.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-actions">
        <input
          className="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('messagePlaceholder')}
        />
        <button type="button" className="btn btn-primary" onClick={send}>
          {t('sendMessage')}
        </button>
      </div>
    </section>
  );
}
