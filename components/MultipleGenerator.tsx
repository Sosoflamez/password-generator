type Props = {
    countStr: string;
    count: number;
    noOptionSelected: boolean;
    multipleRef: React.RefObject<HTMLDivElement | null>;
    onCountChange: (val: string) => void;
    onCountBlur: () => void;
    onGenerate: () => void;
    onBtnEnter: (el: HTMLElement) => void;
    onBtnLeave: (el: HTMLElement) => void;
};

export default function MultipleGenerator({
    countStr, count, noOptionSelected, multipleRef,
    onCountChange, onCountBlur, onGenerate, onBtnEnter, onBtnLeave,
}: Props) {
    return (
        <div ref={multipleRef} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px", opacity: 0 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", background: "rgba(0,8,0,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", overflow: "hidden", backdropFilter: "blur(8px)" }}>
                <span style={{ padding: "10px 14px", fontSize: "12px", color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace", borderRight: "1px solid rgba(255,255,255,0.06)" }}>×</span>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={countStr}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d+$/.test(val)) onCountChange(val);
                    }}
                    onBlur={onCountBlur}
                    style={{ flex: 1, background: "transparent", border: "none", color: "#fff", padding: "10px 14px", fontSize: "14px", fontFamily: "'Space Mono', monospace", outline: "none" }}
                />
            </div>
            <button
                onClick={onGenerate}
                disabled={noOptionSelected}
                onMouseEnter={(e) => onBtnEnter(e.currentTarget)}
                onMouseLeave={(e) => onBtnLeave(e.currentTarget)}
                style={{ padding: "10px 20px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,8,0,0.85)", color: "rgba(255,255,255,0.6)", fontSize: "13px", cursor: noOptionSelected ? "not-allowed" : "pointer", fontFamily: "'Space Mono', monospace", fontWeight: 600, opacity: noOptionSelected ? 0.3 : 1, whiteSpace: "nowrap", backdropFilter: "blur(8px)" }}
            >
                Copier {count > 1 ? `${count} mdp` : "1 mdp"}
            </button>
        </div>
    );
}