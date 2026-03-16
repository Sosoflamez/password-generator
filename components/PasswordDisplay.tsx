import { useRef } from "react";

type Props = {
  password: string;
  copied: boolean;
  noOptionSelected: boolean;
  onGenerate: () => void;
  onCopy: () => void;
  passwordDisplayRef: React.RefObject<HTMLDivElement | null>;
  passwordTextRef: React.RefObject<HTMLSpanElement | null>;
  onBtnEnter: (el: HTMLElement) => void;
  onBtnLeave: (el: HTMLElement) => void;
};

export default function PasswordDisplay({
  password,
  copied,
  noOptionSelected,
  onGenerate,
  onCopy,
  passwordDisplayRef,
  passwordTextRef,
  onBtnEnter,
  onBtnLeave,
}: Props) {
  return (
    <div
      ref={passwordDisplayRef}
      style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,255,65,0.2)", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", minHeight: "64px" }}
    >
      <span
        ref={passwordTextRef}
        style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(13px, 2.5vw, 16px)", color: noOptionSelected ? "rgba(255,255,255,0.2)" : "#00ff41", letterSpacing: "1px", wordBreak: "break-all", flex: 1, transition: "color 0.3s", textShadow: noOptionSelected ? "none" : "0 0 10px rgba(0,255,65,0.4)" }}
      >
        {noOptionSelected ? "Sélectionnez une option..." : password || "—"}
      </span>

      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          onClick={onGenerate}
          disabled={noOptionSelected}
          title="Régénérer"
          onMouseEnter={(e) => onBtnEnter(e.currentTarget)}
          onMouseLeave={(e) => onBtnLeave(e.currentTarget)}
          style={{ width: "38px", height: "38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: noOptionSelected ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", opacity: noOptionSelected ? 0.3 : 1 }}
        >
          ↻
        </button>
        <button
          onClick={onCopy}
          disabled={!password || noOptionSelected}
          onMouseEnter={(e) => onBtnEnter(e.currentTarget)}
          onMouseLeave={(e) => onBtnLeave(e.currentTarget)}
          style={{ padding: "0 16px", height: "38px", borderRadius: "8px", border: copied ? "1px solid #00ff41" : "1px solid rgba(255,255,255,0.12)", background: copied ? "rgba(0,255,65,0.12)" : "transparent", color: copied ? "#00ff41" : "rgba(255,255,255,0.5)", cursor: !password || noOptionSelected ? "not-allowed" : "pointer", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1px", transition: "all 0.25s", opacity: !password || noOptionSelected ? 0.3 : 1, whiteSpace: "nowrap" }}
        >
          {copied ? "✓ COPIÉ" : "COPIER"}
        </button>
      </div>
    </div>
  );
}