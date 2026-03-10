import { PasswordOptions } from "@/lib/password";

const OPTIONS_CONFIG = [
    { key: "lowercase", label: "Minuscules", example: "abc" },
    { key: "uppercase", label: "Majuscules", example: "ABC" },
    { key: "numbers", label: "Chiffres", example: "123" },
    { key: "symbols", label: "Symboles", example: "!@#" },
    { key: "excludeAmbiguous", label: "Exclure ambigus", example: "Il1O0" },
];

type Props = {
    options: PasswordOptions;
    optionsRef: React.RefObject<HTMLDivElement>;
    onChange: (key: string, checked: boolean) => void;
};

export default function OptionsGrid({ options, optionsRef, onChange }: Props) {
    return (
        <div ref={optionsRef} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {OPTIONS_CONFIG.map(({ key, label, example }) => (
                <label
                    key={key}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: (options as Record<string, boolean>)[key] ? "rgba(0,255,65,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${(options as Record<string, boolean>)[key] ? "rgba(0,255,65,0.35)" : "rgba(255,255,255,0.08)"}`, borderRadius: "10px", cursor: "pointer", transition: "background 0.2s, border-color 0.2s", gridColumn: key === "excludeAmbiguous" ? "span 2" : "auto", opacity: 0 }}
                >
                    <input
                        type="checkbox"
                        name={key}
                        checked={(options as Record<string, boolean>)[key]}
                        onChange={(e) => onChange(key, e.target.checked)}
                    />
                    <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: (options as Record<string, boolean>)[key] ? "#00ff41" : "rgba(255,255,255,0.75)" }}>{label}</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace" }}>{example}</div>
                    </div>
                </label>
            ))}
        </div>
    );
}