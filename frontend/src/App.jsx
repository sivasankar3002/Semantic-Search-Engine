import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import DocumentManager from './components/DocumentManager'
import Statistics from './components/Statistics'
import * as api from './api/searchApi'

export default function App() {
    const [activeTab, setActiveTab] = useState('search')
    const [apiStatus, setApiStatus] = useState('checking')
    const [results, setResults] = useState([])
    const [multiResults, setMultiResults] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchMethod, setSearchMethod] = useState('')
    const [loading, setLoading] = useState(false)

    // Health check
    useEffect(() => {
        const check = async () => {
            try {
                const data = await api.checkHealth()
                setApiStatus(data.status === 'ok' ? 'ok' : 'error')
            } catch {
                setApiStatus('error')
            }
        }
        check()
        const interval = setInterval(check, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleSearch = useCallback(async (query, topK, threshold) => {
        setLoading(true)
        setMultiResults(null)
        setSearchQuery(query)
        try {
            const data = await api.semanticSearch(query, topK, threshold)
            setResults(data.results || [])
            setSearchMethod(data.search_method || '')
        } catch (err) {
            console.error('Search error:', err)
            setResults([])
        } finally {
            setLoading(false)
        }
    }, [])

    const handleMultiSearch = useCallback(async (queries, topK, threshold) => {
        setLoading(true)
        setResults([])
        setSearchQuery('')
        try {
            const data = await api.multiQuerySearch(queries, topK, threshold)
            setMultiResults(data.results || {})
        } catch (err) {
            console.error('Multi-search error:', err)
            setMultiResults({})
        } finally {
            setLoading(false)
        }
    }, [])

    const tabs = [
        { id: 'search', label: 'Search', icon: '🔍' },
        { id: 'documents', label: 'Documents', icon: '📄' },
        { id: 'statistics', label: 'Statistics', icon: '📊' },
    ]

    return (
        <div className="app">
            <Header apiStatus={apiStatus} />

            <main className="main">
                <nav className="tab-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="tab-content">
                    {activeTab === 'search' && (
                        <div className="fade-in">
                            <SearchBar onSearch={handleSearch} onMultiSearch={handleMultiSearch} loading={loading} />
                            <SearchResults results={results} query={searchQuery} searchMethod={searchMethod} multiResults={multiResults} />
                        </div>
                    )}
                    {activeTab === 'documents' && (
                        <div className="fade-in">
                            <DocumentManager />
                        </div>
                    )}
                    {activeTab === 'statistics' && (
                        <div className="fade-in">
                            <Statistics />
                        </div>
                    )}
                </div>
            </main>

            <footer className="footer">
                <p>© 2024 Semantic Search Engine | Powered by React, Express.js, MongoDB Atlas & Python AI</p>
            </footer>
        </div>
    )
}
