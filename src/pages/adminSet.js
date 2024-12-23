import { useState } from 'react';
import styles from './AdminSet.module.css';

export default function AdminSet() {
    const [uid, setUid] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/setAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid, password }),
        });

        const data = await response.json();
        setMessage(data.message || data.error);
    };

    return (
        <div className={styles.container}>
            <h2>Set Admin</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="User ID"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    required
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Set Admin</button>
                {message && <p className={styles.message}>{message}</p>}
            </form>
        </div>
    );
} 