import { useState } from 'react'

export default function Header({ apiStatus }) {
    return (
        <header className="header">
            <div className="header-inner">
                <div className="header-left">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="7" />
                            <path d="M21 21l-4.35-4.35" />
                            <path d="M11 8v6M8 11h6" />
                        </svg>
                    </div>
                    <div>
                        <h1>Semantic Search Engine</h1>
                        <p className="tagline">AI-Powered Context-Aware Document Search</p>
                    </div>
                </div>
                <div className="header-right">
                    <span className={`status-dot ${apiStatus === 'ok' ? 'online' : 'offline'}`} />
                    <span className="status-text">
                        {apiStatus === 'ok' ? 'API Connected' : 'API Disconnected'}
                    </span>
                </div>
            </div>
        </header>
    )
}
