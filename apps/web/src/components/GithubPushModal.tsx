import { useState, useEffect } from 'react';
import styles from './GithubPushModal.module.css';

export interface GithubPushModalProps {
  open: boolean;
  onClose: () => void;
  fileName: string;
  fileContent: string;
  projectName?: string;
  isBase64?: boolean;
}

export function GithubPushModal({
  open,
  onClose,
  fileName,
  fileContent,
  projectName = 'my-design-project',
  isBase64 = false,
}: GithubPushModalProps) {
  const [repo, setRepo] = useState(() => {
    try {
      return localStorage.getItem('open-design:github-repo') || '';
    } catch {
      return '';
    }
  });
  const [branch, setBranch] = useState(() => {
    try {
      return localStorage.getItem('open-design:github-branch') || 'main';
    } catch {
      return 'main';
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('open-design:github-token') || '';
    } catch {
      return '';
    }
  });
  const [commitMessage, setCommitMessage] = useState(
    `feat: update ${fileName || 'design artifacts'} via OpenDesign`
  );
  const [targetPath, setTargetPath] = useState(() => fileName || 'index.html');
  const [status, setStatus] = useState<'idle' | 'pushing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [commitUrl, setCommitUrl] = useState('');
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    if (fileName) {
      setTargetPath(fileName);
      setCommitMessage(`feat: update ${fileName} via OpenDesign`);
    }
  }, [fileName]);

  if (!open) return null;

  async function handlePush() {
    const trimmedRepo = repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    const trimmedToken = token.trim();
    const trimmedBranch = branch.trim() || 'main';
    const trimmedPath = targetPath.trim().replace(/^\//, '');

    if (!trimmedRepo || !trimmedRepo.includes('/')) {
      setErrorMessage('Vui lòng nhập định dạng repository: owner/repo (ví dụ: myname/my-app)');
      setStatus('error');
      return;
    }

    if (!trimmedToken) {
      setErrorMessage('Vui lòng cung cấp GitHub Personal Access Token (PAT) có quyền repo.');
      setStatus('error');
      return;
    }

    setStatus('pushing');
    setErrorMessage('');
    setCommitUrl('');

    try {
      localStorage.setItem('open-design:github-repo', trimmedRepo);
      localStorage.setItem('open-design:github-branch', trimmedBranch);
      localStorage.setItem('open-design:github-token', trimmedToken);
    } catch {
      /* ignore */
    }

    try {
      const [owner, repoName] = trimmedRepo.split('/');
      const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${trimmedPath}?ref=${trimmedBranch}`;

      // Step 1: Check if file already exists to get its SHA
      let fileSha: string | undefined = undefined;
      const getRes = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${trimmedToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (getRes.status === 200) {
        const fileInfo = await getRes.json();
        fileSha = fileInfo.sha;
      } else if (getRes.status !== 404 && getRes.status !== 401) {
        const errJson = await getRes.json().catch(() => ({}));
        throw new Error(errJson.message || `Lỗi kiểm tra tệp: HTTP ${getRes.status}`);
      }

      // Step 2: Base64 encode content (handles binary or utf-8 properly)
      let base64Content = '';
      if (isBase64) {
        base64Content = fileContent;
      } else {
        const utf8Bytes = new TextEncoder().encode(fileContent);
        let binaryStr = '';
        for (let i = 0; i < utf8Bytes.length; i++) {
          const byte = utf8Bytes[i];
          if (typeof byte === 'number') {
            binaryStr += String.fromCharCode(byte);
          }
        }
        base64Content = btoa(binaryStr);
      }

      // Step 3: Put/Create the file
      const putRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${trimmedPath}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${trimmedToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage.trim() || `feat: update ${trimmedPath}`,
          content: base64Content,
          branch: trimmedBranch,
          sha: fileSha,
        }),
      });

      if (!putRes.ok) {
        const err = await putRes.json().catch(() => ({}));
        throw new Error(err.message || `Lỗi đẩy GitHub: HTTP ${putRes.status}`);
      }

      const resData = await putRes.json();
      const htmlUrl = resData.content?.html_url || `https://github.com/${trimmedRepo}/blob/${trimmedBranch}/${trimmedPath}`;
      setCommitUrl(htmlUrl);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Có lỗi xảy ra khi đẩy lên GitHub.');
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <h2>Đẩy lên GitHub</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label>Repository (owner/repo)</label>
            <input
              type="text"
              placeholder="ví dụ: octocat/my-website"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              disabled={status === 'pushing'}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Branch</label>
              <input
                type="text"
                placeholder="main"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                disabled={status === 'pushing'}
              />
            </div>
            <div className={styles.field}>
              <label>Đường dẫn tệp trong repo</label>
              <input
                type="text"
                placeholder="index.html"
                value={targetPath}
                onChange={(e) => setTargetPath(e.target.value)}
                disabled={status === 'pushing'}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Commit Message</label>
            <input
              type="text"
              placeholder="feat: update design artifacts"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              disabled={status === 'pushing'}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelWithLink}>
              <label>GitHub Personal Access Token (PAT)</label>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=OpenDesign%20Push"
                target="_blank"
                rel="noreferrer"
              >
                Tạo Token mới ↗
              </a>
            </div>
            <div className={styles.tokenWrapper}>
              <input
                type={showToken ? 'text' : 'password'}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={status === 'pushing'}
              />
              <button
                type="button"
                className={styles.toggleVisibility}
                onClick={() => setShowToken((v) => !v)}
              >
                {showToken ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
            <span className={styles.hint}>
              Token được lưu an toàn trên trình duyệt cục bộ của bạn để tiện dùng cho các lần sau.
            </span>
          </div>

          {status === 'error' && (
            <div className={styles.errorAlert}>
              ⚠️ {errorMessage}
            </div>
          )}

          {status === 'success' && (
            <div className={styles.successAlert}>
              ✓ Đẩy lên GitHub thành công!{' '}
              <a href={commitUrl} target="_blank" rel="noreferrer">
                Xem tệp trên GitHub ↗
              </a>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={status === 'pushing'}>
            Hủy
          </button>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handlePush}
            disabled={status === 'pushing'}
          >
            {status === 'pushing' ? 'Đang đẩy lên GitHub…' : 'Đẩy ngay'}
          </button>
        </div>
      </div>
    </div>
  );
}
