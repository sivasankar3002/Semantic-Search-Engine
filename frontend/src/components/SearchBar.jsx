import { useState } from 'react'

export default function SearchBar({ onSearch, onMultiSearch, loading }) {
    const [query, setQuery] = useState('')
    const [topK, setTopK] = useState(5)
    const [threshold, setThreshold] = useState(0.3)
    const [multiQueries, setMultiQueries] = useState('')
    const [showMulti, setShowMulti] = useState(false)

    const handleSearch = (e) => {
        e.preventDefault()
        if (query.trim()) onSearch(query.trim(), topK, threshold)
    }

    const handleMultiSearch = () => {
        const queries = multiQueries.split('\n').map(q => q.trim()).filter(q => q)
        if (queries.length > 0) onMultiSearch(queries, topK, threshold)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSearch(e)
        }
    }

    return (
        <div className="search-section">
            <div className="card glass">
                <h2>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="section-icon">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    Semantic Search
                </h2>
                <p className="description">Enter natural language queries to find semantically similar documents</p>

                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="How does machine learning work?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            id="searchQuery"
                        />
                        <button type="submit" className="btn btn-primary search-btn" disabled={loading || !query.trim()} id="searchBtn">
                            {loading ? (
                                <span className="btn-spinner" />
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                                    </svg>
                                    Search
                                </>
                            )}
                        </button>
                    </div>

                    <div className="search-controls">
                        <div className="control-group">
                            <label htmlFor="topK">Top Results</label>
                            <input type="number" id="topK" value={topK} onChange={(e) => setTopK(Number(e.target.value))} min={1} max={20} />
                        </div>
                        <div className="control-group">
                            <label htmlFor="threshold">Threshold</label>
                            <input type="number" id="threshold" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} min={0} max={1} step={0.05} />
                        </div>
                        <button type="button" className="btn btn-ghost" onClick={() => setShowMulti(!showMulti)}>
                            {showMulti ? 'Hide' : 'Multi-Query'}
                        </button>
                    </div>
                </form>

                {showMulti && (
                    <div className="multi-query-section fade-in">
                        <h3>Multi-Query Search</h3>
                        <textarea
                            className="multi-input"
                            placeholder={"Enter multiple queries (one per line):\nWhat is artificial intelligence?\nHow does deep learning work?\nExplain neural networks"}
                            value={multiQueries}
                            onChange={(e) => setMultiQueries(e.target.value)}
                            rows={4}
                            id="multiQueries"
                        />
                        <button className="btn btn-secondary" onClick={handleMultiSearch} disabled={loading} id="multiSearchBtn">
                            Search Multiple
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
