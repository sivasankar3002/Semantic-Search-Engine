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

    return (
        <div className="search-section">
            <div className="card">
                <h2>Search documents</h2>
                <p className="description">Find semantically similar documents using natural language</p>

                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Try: How does machine learning work?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            id="searchQuery"
                        />
                        <button type="submit" className="btn btn-primary search-btn" disabled={loading || !query.trim()} id="searchBtn">
                            {loading ? <span className="btn-spinner" /> : 'Search'}
                        </button>
                    </div>

                    <div className="search-controls">
                        <div className="control-group">
                            <label htmlFor="topK">Results</label>
                            <input type="number" id="topK" value={topK} onChange={(e) => setTopK(Number(e.target.value))} min={1} max={20} />
                        </div>
                        <div className="control-group">
                            <label htmlFor="threshold">Min Score</label>
                            <input type="number" id="threshold" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} min={0} max={1} step={0.05} />
                        </div>
                        <button type="button" className="btn btn-ghost" onClick={() => setShowMulti(!showMulti)}>
                            {showMulti ? '← Single' : 'Multi-query →'}
                        </button>
                    </div>
                </form>

                {showMulti && (
                    <div className="multi-query-section fade-in">
                        <h3>Multi-query search</h3>
                        <textarea
                            className="multi-input"
                            placeholder={"One query per line:\nWhat is artificial intelligence?\nExplain neural networks\nclimate change solutions"}
                            value={multiQueries}
                            onChange={(e) => setMultiQueries(e.target.value)}
                            rows={3}
                            id="multiQueries"
                        />
                        <button className="btn btn-secondary" onClick={handleMultiSearch} disabled={loading} id="multiSearchBtn">
                            Search all queries
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
