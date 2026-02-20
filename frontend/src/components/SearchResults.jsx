export default function SearchResults({ results, query, searchMethod, multiResults }) {
    if (multiResults && Object.keys(multiResults).length > 0) {
        return (
            <div className="results-section fade-in">
                <h3 className="results-title">Multi-Query Results</h3>
                {Object.entries(multiResults).map(([q, qResults]) => (
                    <div key={q} className="multi-result-group">
                        <h4 className="query-label">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-icon">
                                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                            </svg>
                            "{q}"
                        </h4>
                        {qResults.length > 0 ? (
                            qResults.map((result, i) => <ResultCard key={i} result={result} />)
                        ) : (
                            <p className="no-results-text">No results for this query</p>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    if (!results || results.length === 0) {
        return query ? (
            <div className="no-results fade-in">
                <div className="no-results-icon">🔍</div>
                <h3>No results found</h3>
                <p>Try different keywords or lower the similarity threshold</p>
            </div>
        ) : null
    }

    return (
        <div className="results-section fade-in">
            <div className="results-header">
                <h3 className="results-title">
                    {results.length} Result{results.length !== 1 ? 's' : ''} for "{query}"
                </h3>
                {searchMethod && (
                    <span className={`method-badge ${searchMethod === 'atlas_vector' ? 'atlas' : 'fallback'}`}>
                        {searchMethod === 'atlas_vector' ? '⚡ Atlas Vector' : '🔄 Cosine Similarity'}
                    </span>
                )}
            </div>
            {results.map((result, index) => (
                <ResultCard key={index} result={result} rank={index + 1} />
            ))}
        </div>
    )
}

function ResultCard({ result, rank }) {
    const score = result.similarity_score
    const percent = (score * 100).toFixed(1)
    const barColor = score > 0.7 ? '#10b981' : score > 0.4 ? '#f59e0b' : '#6366f1'

    return (
        <div className="result-card">
            <div className="result-card-header">
                <div className="result-info">
                    {rank && <span className="rank">#{rank}</span>}
                    <h4 className="result-title">{result.title}</h4>
                    {result.category && <span className="category-tag">{result.category}</span>}
                </div>
                <div className="similarity-badge" style={{ background: barColor }}>
                    {percent}%
                </div>
            </div>
            <p className="result-content">{result.content}</p>
            <div className="similarity-bar-track">
                <div className="similarity-bar-fill" style={{ width: `${percent}%`, background: barColor }} />
            </div>
        </div>
    )
}
