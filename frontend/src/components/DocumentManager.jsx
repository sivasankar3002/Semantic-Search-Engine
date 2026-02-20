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
        setTimeout(() => setMessage(null), 3000)
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) return showMsg('Title and content are required', 'error')

        let meta = {}
        if (metadata.trim()) {
            try { meta = JSON.parse(metadata) }
            catch { return showMsg('Invalid JSON metadata', 'error') }
        }

        setLoading(true)
        try {
            const res = await api.addDocument(title, content, meta)
            if (res.success) {
                showMsg('Document added')
                setTitle(''); setContent(''); setMetadata('')
                loadDocs()
            }
        } catch (err) {
            showMsg(err.message, 'error')
        } finally { setLoading(false) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this document?')) return
        try {
            await api.deleteDocument(id)
            showMsg('Deleted')
            loadDocs()
        } catch (err) { showMsg(err.message, 'error') }
    }

    const handleLoadSample = async () => {
        setLoading(true)
        try {
            const res = await api.loadSampleData()
            showMsg(res.message || 'Sample data loaded')
            loadDocs()
        } catch (err) {
            showMsg(err.response?.data?.error || err.message, 'error')
        } finally { setLoading(false) }
    }

    const handleClear = async () => {
        if (!confirm('Delete ALL documents?')) return
        setLoading(true)
        try {
            await api.clearData()
            showMsg('All documents cleared')
            loadDocs()
        } catch (err) { showMsg(err.message, 'error') }
        finally { setLoading(false) }
    }

    return (
        <div className="documents-section">
            {/* Add Document */}
            <div className="card">
                <h2>Add document</h2>
                <form onSubmit={handleAdd} className="doc-form">
                    <div className="form-group">
                        <label htmlFor="docTitle">Title</label>
                        <input id="docTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="docContent">Content</label>
                        <textarea id="docContent" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Document content..." className="form-textarea" rows={3} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="docMetadata">Metadata (JSON, optional)</label>
                        <input id="docMetadata" type="text" value={metadata} onChange={(e) => setMetadata(e.target.value)} placeholder='{"category": "AI"}' className="form-input" />
                    </div>
                    <div className="btn-row">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add document'}
                        </button>
                    </div>
                </form>
                {message && <div className={`msg ${message.type}`}>{message.text}</div>}
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2>Quick actions</h2>
                <p className="description">Load sample data or clear the collection</p>
                <div className="btn-row">
                    <button className="btn btn-success" onClick={handleLoadSample} disabled={loading} id="loadSampleBtn">Load sample data</button>
                    <button className="btn btn-danger" onClick={handleClear} disabled={loading} id="clearDataBtn">Clear all</button>
                    <button className="btn btn-ghost" onClick={loadDocs} id="refreshDocsBtn">Refresh</button>
                </div>
            </div>

            {/* Documents List */}
            <div className="card">
                <h2>Documents · {documents.length}</h2>

                {documents.length === 0 ? (
                    <div className="empty-state"><p>No documents. Add one or load sample data above.</p></div>
                ) : (
                    <div className="doc-list">
                        {documents.map((doc) => (
                            <div key={doc._id} className="doc-item">
                                <div className="doc-item-header">
                                    <h4>{doc.title}</h4>
                                    <button className="btn-delete" onClick={() => handleDelete(doc._id)} title="Delete">✕</button>
                                </div>
                                <p className="doc-content-preview">{doc.content?.substring(0, 180)}{doc.content?.length > 180 ? '…' : ''}</p>
                                <div className="doc-meta">
                                    {doc.category && <span className="meta-tag">{doc.category}</span>}
                                    {doc.metadata?.category && !doc.category && <span className="meta-tag">{doc.metadata.category}</span>}
                                    {doc.metadata?.difficulty && <span className="meta-tag">{doc.metadata.difficulty}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
