import React, { useEffect, useState } from 'react';

export function GlassThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current);

    const observer = new MutationObserver(() => {
      const updated = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      setTheme(updated);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = (next: 'light' | 'dark') => {
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('open-design:theme', next);
      const cfg = JSON.parse(localStorage.getItem('open-design:config') || '{}');
      cfg.theme = next;
      localStorage.setItem('open-design:config', JSON.stringify(cfg));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="glass-theme-toggle-container" data-testid="glass-theme-toggle">
      <button
        type="button"
        className={`glass-theme-btn ${theme === 'light' ? 'is-active' : ''}`}
        onClick={() => toggleTheme('light')}
        title="Giao diện Sáng (Light Glass)"
        aria-label="Giao diện Sáng"
      >
        <span className="glass-theme-icon">☀️</span>
        <span className="glass-theme-label">Sáng</span>
      </button>
      <button
        type="button"
        className={`glass-theme-btn ${theme === 'dark' ? 'is-active' : ''}`}
        onClick={() => toggleTheme('dark')}
        title="Giao diện Tối (Dark Glass)"
        aria-label="Giao diện Tối"
      >
        <span className="glass-theme-icon">🌙</span>
        <span className="glass-theme-label">Tối</span>
      </button>
    </div>
  );
}
