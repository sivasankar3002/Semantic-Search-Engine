export default function SearchResults({ results, query, searchMethod, multiResults }) {
    if (multiResults && Object.keys(multiResults).length > 0) {
        return (
            <div className="results-section fade-in">
                {Object.entries(multiResults).map(([q, qResults]) => (
                    <div key={q} className="multi-result-group">
                        <div className="query-label">"{q}"</div>
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
                <div className="no-results-icon">∅</div>
                <h3>No results found</h3>
                <p>Try different keywords or lower the minimum score</p>
            </div>
        ) : null
    }

    return (
        <div className="results-section fade-in">
            <div className="results-header">
                <span className="results-title">
                    {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </span>
                {searchMethod && (
                    <span className={`method-badge ${searchMethod === 'atlas_vector' ? 'atlas' : 'fallback'}`}>
                        {searchMethod === 'atlas_vector' ? 'Atlas Vector' : 'Cosine Similarity'}
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
    const hue = score > 0.7 ? 160 : score > 0.45 ? 45 : 260

    return (
        <div className="result-card">
            <div className="result-card-header">
                <div className="result-info">
                    {rank && <span className="rank">#{rank}</span>}
                    <span className="result-title">{result.title}</span>
                    {result.category && <span className="category-tag">{result.category}</span>}
                </div>
                <div className="similarity-badge" style={{ background: `hsl(${hue}, 60%, 50%)` }}>
                    {percent}%
                </div>
            </div>
            <p className="result-content">{result.content}</p>
            <div className="similarity-bar-track">
                <div className="similarity-bar-fill" style={{ width: `${percent}%`, background: `hsl(${hue}, 60%, 50%)` }} />
            </div>
        </div>
    )
}
