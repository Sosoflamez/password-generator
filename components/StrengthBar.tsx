type Props = {
    entropy: number;
    strength: { label: string; color: string; width: string };
    strengthBarRef: React.RefObject<HTMLDivElement>;
};

export default function StrengthBar({ entropy, strength, strengthBarRef }: Props) {
    return (
        <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", letterSpacing: "1px", fontFamily: "'Space Mono', monospace" }}>ROBUSTESSE</span>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.3)" }}>{entropy} bits</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: strength.color, fontFamily: "'Space Mono', monospace", transition: "color 0.4s" }}>{strength.label}</span>
                </div>
            </div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                <div ref={strengthBarRef} style={{ height: "100%", width: "0%", background: "#00ff41", borderRadius: "2px", boxShadow: "0 0 8px rgba(0,255,65,0.6)" }} />
            </div>
        </div>
    );
}