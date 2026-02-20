import { useState, useEffect } from 'react'
import * as api from '../api/searchApi'

export default function Statistics() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadStats = async () => {
        setLoading(true)
        try {
            const data = await api.getStats()
            if (data.success) setStats(data.statistics)
        } catch (err) { console.error(err) }
        finally { setLoading(false) }
    }

    useEffect(() => { loadStats() }, [])

    return (
        <div className="stats-section">
            <div className="card">
                <div className="card-header-row">
                    <h2>Statistics</h2>
                    <button className="btn btn-ghost" onClick={loadStats} id="refreshStatsBtn">Refresh</button>
                </div>

                {loading ? (
                    <div className="loading-text">Loading…</div>
                ) : stats ? (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card gradient-1">
                                <div className="stat-icon">📄</div>
                                <div className="stat-value" id="statDocCount">{stats.total_documents}</div>
                                <div className="stat-label">Documents</div>
                            </div>
                            <div className="stat-card gradient-2">
                                <div className="stat-icon">🤖</div>
                                <div className="stat-value stat-sm" id="statModel">{(stats.embedding_model || '').split('/').pop()}</div>
                                <div className="stat-label">Model</div>
                            </div>
                            <div className="stat-card gradient-3">
                                <div className="stat-icon">🎯</div>
                                <div className="stat-value" id="statThreshold">{stats.similarity_threshold}</div>
                                <div className="stat-label">Threshold</div>
                            </div>
                            <div className="stat-card gradient-4">
                                <div className="stat-icon">{stats.nlp_service_status === 'ok' ? '✅' : '⚠️'}</div>
                                <div className="stat-value stat-sm">{stats.nlp_service_status === 'ok' ? 'Online' : 'Offline'}</div>
                                <div className="stat-label">NLP Service</div>
                            </div>
                        </div>

                        <div className="system-info">
                            <h3>System</h3>
                            <div className="info-grid">
                                <div className="info-row"><span className="info-label">Backend</span><span className="info-val">Node.js + Express.js</span></div>
                                <div className="info-row"><span className="info-label">AI/NLP</span><span className="info-val">Python + Sentence Transformers</span></div>
                                <div className="info-row"><span className="info-label">Database</span><span className="info-val">MongoDB Atlas Vector Search</span></div>
                                <div className="info-row"><span className="info-label">Frontend</span><span className="info-val">React.js + Vite</span></div>
                                <div className="info-row"><span className="info-label">Updated</span><span className="info-val" id="lastUpdated">{new Date(stats.timestamp).toLocaleString()}</span></div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="error-text">Failed to load statistics</p>
                )}
            </div>
        </div>
    )
}
