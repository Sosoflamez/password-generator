type Props = {
    history: string[];
    showHistory: boolean;
    onToggle: () => void;
    onCopy: (pw: string) => void;
    onBtnEnter: (el: HTMLElement) => void;
    onBtnLeave: (el: HTMLElement) => void;
};

export default function HistoryPanel({ history, showHistory, onToggle, onCopy, onBtnEnter, onBtnLeave }: Props) {
    if (history.length === 0) return null;

    return (
        <div style={{ background: "rgba(0,8,0,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden", backdropFilter: "blur(8px)" }}>
            <button
                onClick={onToggle}
                style={{ width: "100%", padding: "14px 20px", background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Space Mono', monospace" }}
            >
                <span>Historique récent</span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{history.length} entrée{history.length > 1 ? "s" : ""} {showHistory ? "▲" : "▼"}</span>
            </button>

            {showHistory && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    {history.map((pw, i) => (
                        <div key={i} style={{ padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < history.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", gap: "12px" }}>
                            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{pw}</span>
                            <button
                                onClick={() => onCopy(pw)}
                                onMouseEnter={(e) => onBtnEnter(e.currentTarget)}
                                onMouseLeave={(e) => onBtnLeave(e.currentTarget)}
                                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "rgba(255,255,255,0.4)", padding: "4px 10px", fontSize: "10px", cursor: "pointer", fontFamily: "'Space Mono', monospace", flexShrink: 0 }}
                            >
                                COPIER
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}