import { useState, useEffect, useCallback } from 'react'
import * as api from '../api/searchApi'

export default function DocumentManager() {
    const [documents, setDocuments] = useState([])
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [metadata, setMetadata] = useState('')
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    const loadDocs = useCallback(async () => {
        try {
            const data = await api.getDocuments()
            if (data.success) setDocuments(data.documents)
        } catch (err) {
            console.error('Load docs error:', err)
        }
    }, [])

    useEffect(() => { loadDocs() }, [loadDocs])

    const showMsg = (text, type = 'success') => {
        setMessage({ text, type })
        setTimeout(() => setMessage(null), 4000)
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) return showMsg('Title and content required', 'error')

        let meta = {}
        if (metadata.trim()) {
            try { meta = JSON.parse(metadata) }
            catch { return showMsg('Invalid JSON in metadata', 'error') }
        }

        setLoading(true)
        try {
            const res = await api.addDocument(title, content, meta)
            if (res.success) {
                showMsg('Document added successfully!')
                setTitle(''); setContent(''); setMetadata('')
                loadDocs()
            }
        } catch (err) {
            showMsg(err.message, 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this document?')) return
        try {
            await api.deleteDocument(id)
            showMsg('Document deleted')
            loadDocs()
        } catch (err) {
            showMsg(err.message, 'error')
        }
    }

    const handleLoadSample = async () => {
        setLoading(true)
        try {
            const res = await api.loadSampleData()
            showMsg(res.message || 'Sample data loaded!')
            loadDocs()
        } catch (err) {
            showMsg(err.response?.data?.error || err.message, 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleClear = async () => {
        if (!confirm('Delete ALL documents? This cannot be undone.')) return
        setLoading(true)
        try {
            await api.clearData()
            showMsg('All documents cleared')
            loadDocs()
        } catch (err) {
            showMsg(err.message, 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="documents-section">
            {/* Add Document */}
            <div className="card glass">
                <h2>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="section-icon">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Document
                </h2>
                <form onSubmit={handleAdd} className="doc-form">
                    <div className="form-group">
                        <label htmlFor="docTitle">Title *</label>
                        <input id="docTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter document title" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="docContent">Content *</label>
                        <textarea id="docContent" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter document content" className="form-textarea" rows={4} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="docMetadata">Metadata (JSON)</label>
                        <textarea id="docMetadata" value={metadata} onChange={(e) => setMetadata(e.target.value)} placeholder='{"category": "AI", "difficulty": "beginner"}' className="form-textarea" rows={2} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Document'}
                    </button>
                </form>
                {message && <div className={`msg ${message.type}`}>{message.text}</div>}
            </div>

            {/* Sample Data */}
            <div className="card glass">
                <h2>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="section-icon">
                        <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7" />
                        <ellipse cx="12" cy="7" rx="8" ry="4" />
                    </svg>
                    Sample Data
                </h2>
                <p className="description">Load pre-configured sample documents for testing</p>
                <div className="btn-row">
                    <button className="btn btn-success" onClick={handleLoadSample} disabled={loading} id="loadSampleBtn">Load Sample Data</button>
                    <button className="btn btn-danger" onClick={handleClear} disabled={loading} id="clearDataBtn">Clear All Data</button>
                </div>
            </div>

            {/* Documents List */}
            <div className="card glass">
                <div className="card-header-row">
                    <h2>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="section-icon">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                        </svg>
                        Documents ({documents.length})
                    </h2>
                    <button className="btn btn-ghost" onClick={loadDocs} id="refreshDocsBtn">↻ Refresh</button>
                </div>

                {documents.length === 0 ? (
                    <div className="empty-state">
                        <p>No documents yet. Add one or load sample data.</p>
                    </div>
                ) : (
                    <div className="doc-list">
                        {documents.map((doc) => (
                            <div key={doc._id} className="doc-item">
                                <div className="doc-item-header">
                                    <h4>{doc.title}</h4>
                                    <button className="btn-delete" onClick={() => handleDelete(doc._id)}>✕</button>
                                </div>
                                <p className="doc-content-preview">{doc.content?.substring(0, 200)}{doc.content?.length > 200 ? '...' : ''}</p>
                                <div className="doc-meta">
                                    {doc.category && <span className="meta-tag">{doc.category}</span>}
                                    {doc.metadata && Object.keys(doc.metadata).length > 0 && (
                                        <span className="meta-tag">{JSON.stringify(doc.metadata)}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
