export default function Header({ apiStatus }) {
    return (
        <header className="header">
            <div className="header-inner">
                <div className="header-left">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="7" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                    </div>
                    <h1>Semantic Search Engine</h1>
                </div>
                <div className="header-right">
                    <span className={`status-dot ${apiStatus === 'ok' ? 'online' : 'offline'}`} />
                    <span className="status-text">
                        {apiStatus === 'ok' ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>
        </header>
    )
}
