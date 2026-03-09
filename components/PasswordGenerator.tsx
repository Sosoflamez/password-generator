"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  generatePassword,
  evaluateStrength,
  calculateEntropy,
  type PasswordOptions,
} from "@/lib/password";

let gsap: typeof import("gsap").gsap | null = null;

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
  excludeAmbiguous: false,
};

const MATRIX_COLUMNS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: i * 25,
  delay: [
    -2.5, -3.2, -1.8, -2.9, -1.5, -3.8, -2.1, -2.7, -3.4, -1.9, -3.6, -2.3,
    -3.1, -2.6, -3.7, -2.8, -3.3, -2.2, -3.9, -2.4, -1.7, -3.5, -2.0, -4.0,
    -1.6, -3.0, -3.8, -2.5, -3.2, -2.7, -1.8, -3.6, -2.1, -3.4, -2.8, -3.7,
    -2.3, -1.9, -3.5, -2.6,
  ][i],
  duration: [
    3, 4, 2.5, 3.5, 3, 4.5, 2.8, 3.2, 3.8, 2.7, 4.2, 3.1, 3.6, 2.9, 4.1, 3.3,
    3.7, 2.6, 4.3, 3.4, 2.4, 3.9, 3, 4.4, 2.3, 3.5, 4, 2.8, 3.6, 3.2, 2.7, 4.1,
    3.1, 3.7, 2.9, 4.2, 3.3, 2.5, 3.8, 3.4,
  ][i],
  content:
    i % 5 === 4
      ? "ガザダバパギジヂビピグズヅブプゲゼデベペゴゾドボポヴァィゥェォャュョッ!@#$%^&*()_+-=[]{}|;:,.<>?"
      : i % 4 === 3
        ? "ンヲロヨモホノトソコオレメヘネテセケエルユムフヌツスクウリミヒニチシキイワラヤマハナタサカア"
        : i % 3 === 2
          ? "アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロヲン0987654321"
          : i % 2 === 1
            ? "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴァィゥェォャュョッABCDEFGHIJKLMNOPQRSTUVWXYZ"
            : "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
}));

export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [countStr, setCountStr] = useState("1");
  const [gsapLoaded, setGsapLoaded] = useState(false);

  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const passwordDisplayRef = useRef<HTMLDivElement>(null);
  const passwordTextRef = useRef<HTMLSpanElement>(null);
  const strengthBarRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const generateBtnRef = useRef<HTMLButtonElement>(null);
  const multipleRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);
  const count = Math.min(20, Math.max(1, parseInt(countStr) || 1));

  useEffect(() => {
    import("gsap").then((mod) => {
      gsap = mod.gsap;
      setGsapLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!gsapLoaded || !gsap) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(badgeRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(titleRef.current, { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.7 }, "-=0.3")
      .fromTo(subtitleRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.4")
      .fromTo(cardRef.current, { y: 40, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.75 }, "-=0.3")
      .fromTo(generateBtnRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.4")
      .fromTo(multipleRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, "-=0.3")
      .fromTo(footerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.2");

    const optionCards = optionsRef.current?.querySelectorAll("label");
    if (optionCards) {
      tl.fromTo(optionCards, { x: -15, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, stagger: 0.07 }, "-=0.5");
    }
  }, [gsapLoaded]);

  const animatePasswordChange = useCallback(() => {
    if (!gsap) return;
    gsap.timeline()
      .to(passwordTextRef.current, { opacity: 0, y: -8, duration: 0.15, ease: "power2.in" })
      .to(passwordTextRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" });
    gsap.fromTo(
      passwordDisplayRef.current,
      { borderColor: "rgba(0,255,136,0.9)", boxShadow: "0 0 24px rgba(0,255,136,0.35)" },
      { borderColor: "rgba(0,255,65,0.2)", boxShadow: "none", duration: 0.9, ease: "power2.out" },
    );
  }, []);

  const generate = useCallback(() => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setCopied(false);
    if (newPassword) setHistory((prev) => [newPassword, ...prev].slice(0, 10));
    if (gsapLoaded) animatePasswordChange();
  }, [options, gsapLoaded, animatePasswordChange]);

  useEffect(() => { generate(); }, [generate]);

  const strength = evaluateStrength(password, options);
  const entropy = calculateEntropy(password, options);
  useEffect(() => {
    if (!gsap || !strengthBarRef.current) return;
    gsap.to(strengthBarRef.current, { width: strength.width, backgroundColor: strength.color, duration: 0.65, ease: "power2.out" });
  }, [strength.width, strength.color]);

  const copyToClipboard = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const el = document.createElement("textarea");
      el.value = text; document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (gsap && passwordDisplayRef.current) {
      gsap.fromTo(passwordDisplayRef.current, { scale: 1 }, { scale: 1.015, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" });
    }
  };

  const noOptionSelected = !options.lowercase && !options.uppercase && !options.numbers && !options.symbols;

  const generateMultiple = () => {
    const passwords = Array.from({ length: count }, () => generatePassword(options));
    navigator.clipboard.writeText(passwords.join("\n"));
    setHistory((prev) => [...passwords, ...prev].slice(0, 10));
    alert(`${count} mots de passe copiés dans le presse-papiers !`);
  };

  const onBtnEnter = (el: HTMLElement) => {
    if (!gsap || noOptionSelected) return;
    gsap.to(el, { y: -3, scale: 1.02, duration: 0.2, ease: "power2.out" });
  };
  const onBtnLeave = (el: HTMLElement) => {
    if (!gsap) return;
    gsap.to(el, { y: 0, scale: 1, duration: 0.25, ease: "power3.out" });
  };

  const onOptionChange = (key: string, checked: boolean) => {
    setOptions((prev) => ({ ...prev, [key]: checked }));
    if (!gsap || !optionsRef.current) return;
    optionsRef.current.querySelectorAll("label").forEach((label) => {
      const input = label.querySelector("input") as HTMLInputElement;
      if (input?.name === key) {
        gsap!.fromTo(label, { scale: 0.96 }, { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" });
      }
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative", overflow: "hidden" }}>

      <div style={{ position: "absolute", inset: 0, display: "flex", pointerEvents: "none", zIndex: 0 }}>
        {[0, 1, 2, 3, 4].map((patternIdx) => (
          <div key={patternIdx} style={{ position: "relative", width: "1000px", height: "100%", flexShrink: 0 }}>
            {MATRIX_COLUMNS.map((col) => (
              <div
                key={col.id}
                style={{
                  position: "absolute",
                  top: "-100%",
                  left: `${col.left}px`,
                  width: "20px",
                  height: "100%",
                  fontSize: "15px",
                  lineHeight: "18px",
                  fontWeight: "bold",
                  animation: `matrixFall ${col.duration}s ${col.delay}s linear infinite`,
                  whiteSpace: "nowrap",
                  writingMode: "vertical-lr",
                  letterSpacing: "1px",
                  background: "linear-gradient(to bottom, #ffffff 0%, #ffffff 5%, #00ff41 10%, #00ff41 20%, #00dd33 30%, #00bb22 40%, #009911 50%, #007700 60%, #005500 70%, #003300 80%, rgba(0,255,65,0.5) 90%, transparent 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  opacity: 0.55,
                }}
              >
                {col.content}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.88) 100%)", pointerEvents: "none", zIndex: 1 }} />

      <div style={{ width: "100%", maxWidth: "520px", position: "relative", zIndex: 2 }}>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div ref={badgeRef} style={{ display: "inline-flex", alignItems: "center", background: "rgba(0,255,65,0.08)", border: "1px solid rgba(0,255,65,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "20px", opacity: 0 }}>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", fontFamily: "'Space Mono', monospace", letterSpacing: "2px" }}>
              SÉCURISÉ ✦ CRYPTOGRAPHIQUE
            </span>
          </div>
          <h1 ref={titleRef} style={{ fontSize: "clamp(2rem, 6vw, 3.2rem)", fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.1, letterSpacing: "-1px", opacity: 0, textShadow: "0 0 40px rgba(0,255,65,0.3)" }}>
            Pass<span style={{ color: "#00ff41" }}>Ganpko</span>
          </h1>
          <p ref={subtitleRef} style={{ color: "rgba(255,255,255,0.45)", marginTop: "8px", fontSize: "15px", opacity: 0, fontFamily: "'Space Mono', monospace" }}>
            Générez des mots de passe robustes et sécurisés
          </p>
        </div>

        <div ref={cardRef} style={{ background: "rgba(0,8,0,0.85)", border: "1px solid rgba(0,255,65,0.15)", borderRadius: "20px", padding: "28px", marginBottom: "16px", opacity: 0, backdropFilter: "blur(12px)" }}>

          <div ref={passwordDisplayRef} style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,255,65,0.2)", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", minHeight: "64px" }}>
            <span ref={passwordTextRef} style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(13px, 2.5vw, 16px)", color: noOptionSelected ? "rgba(255,255,255,0.2)" : "#00ff41", letterSpacing: "1px", wordBreak: "break-all", flex: 1, transition: "color 0.3s", textShadow: noOptionSelected ? "none" : "0 0 10px rgba(0,255,65,0.4)" }}>
              {noOptionSelected ? "Sélectionnez une option..." : password || "—"}
            </span>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button onClick={generate} disabled={noOptionSelected} title="Régénérer"
                onMouseEnter={(e) => onBtnEnter(e.currentTarget)} onMouseLeave={(e) => onBtnLeave(e.currentTarget)}
                style={{ width: "38px", height: "38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: noOptionSelected ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", opacity: noOptionSelected ? 0.3 : 1 }}>
                ↻
              </button>
              <button onClick={() => copyToClipboard(password)} disabled={!password || noOptionSelected}
                onMouseEnter={(e) => onBtnEnter(e.currentTarget)} onMouseLeave={(e) => onBtnLeave(e.currentTarget)}
                style={{ padding: "0 16px", height: "38px", borderRadius: "8px", border: copied ? "1px solid #00ff41" : "1px solid rgba(255,255,255,0.12)", background: copied ? "rgba(0,255,65,0.12)" : "transparent", color: copied ? "#00ff41" : "rgba(255,255,255,0.5)", cursor: !password || noOptionSelected ? "not-allowed" : "pointer", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1px", transition: "all 0.25s", opacity: !password || noOptionSelected ? 0.3 : 1, whiteSpace: "nowrap" }}>
                {copied ? "✓ COPIÉ" : "COPIER"}
              </button>
            </div>
          </div>

          {password && !noOptionSelected && (
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
          )}

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>Longueur</label>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "18px", fontWeight: 700, color: "#00ff41", textShadow: "0 0 12px rgba(0,255,65,0.5)" }}>{options.length}</span>
            </div>
            <input type="range" min={4} max={64} value={options.length} onChange={(e) => setOptions((prev) => ({ ...prev, length: parseInt(e.target.value) }))} style={{ width: "100%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "'Space Mono', monospace" }}>4</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "'Space Mono', monospace" }}>64</span>
            </div>
          </div>

          <div ref={optionsRef} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { key: "lowercase", label: "Minuscules", example: "abc" },
              { key: "uppercase", label: "Majuscules", example: "ABC" },
              { key: "numbers", label: "Chiffres", example: "123" },
              { key: "symbols", label: "Symboles", example: "!@#" },
              { key: "excludeAmbiguous", label: "Exclure ambigus", example: "Il1O0" },
            ].map(({ key, label, example }) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: (options as Record<string, boolean>)[key] ? "rgba(0,255,65,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${(options as Record<string, boolean>)[key] ? "rgba(0,255,65,0.35)" : "rgba(255,255,255,0.08)"}`, borderRadius: "10px", cursor: "pointer", transition: "background 0.2s, border-color 0.2s", gridColumn: key === "excludeAmbiguous" ? "span 2" : "auto", opacity: 0 }}>
                <input type="checkbox" name={key} checked={(options as Record<string, boolean>)[key]} onChange={(e) => onOptionChange(key, e.target.checked)} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: (options as Record<string, boolean>)[key] ? "#00ff41" : "rgba(255,255,255,0.75)" }}>{label}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace" }}>{example}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button ref={generateBtnRef} onClick={generate} disabled={noOptionSelected}
          onMouseEnter={(e) => { if (!noOptionSelected && gsap) gsap.to(e.currentTarget, { y: -3, scale: 1.02, boxShadow: "0 12px 40px rgba(0,255,65,0.4)", duration: 0.2, ease: "power2.out" }); }}
          onMouseLeave={(e) => { if (gsap) gsap.to(e.currentTarget, { y: 0, scale: 1, boxShadow: "0 4px 20px rgba(0,255,65,0.15)", duration: 0.3, ease: "power3.out" }); }}
          onMouseDown={(e) => { if (gsap) gsap.to(e.currentTarget, { scale: 0.97, duration: 0.1 }); }}
          onMouseUp={(e) => { if (gsap) gsap.to(e.currentTarget, { scale: 1.02, duration: 0.15 }); }}
          style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid rgba(0,255,65,0.4)", background: noOptionSelected ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, rgba(0,255,65,0.9), rgba(0,200,50,0.85))", color: noOptionSelected ? "rgba(255,255,255,0.2)" : "#000", fontSize: "15px", fontWeight: 700, fontFamily: "'Space Mono', monospace", letterSpacing: "1px", cursor: noOptionSelected ? "not-allowed" : "pointer", boxShadow: noOptionSelected ? "none" : "0 4px 20px rgba(0,255,65,0.15)", marginBottom: "12px", opacity: 0 }}>
          GÉNÉRER UN NOUVEAU MOT DE PASSE
        </button>

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
                if (val === "" || /^\d+$/.test(val)) setCountStr(val);
              }}
              onBlur={() => {
                const n = parseInt(countStr) || 1;
                setCountStr(String(Math.min(20, Math.max(1, n))));
              }}
              style={{ flex: 1, background: "transparent", border: "none", color: "#fff", padding: "10px 14px", fontSize: "14px", fontFamily: "'Space Mono', monospace", outline: "none" }}
            />
          </div>
          <button onClick={generateMultiple} disabled={noOptionSelected}
            onMouseEnter={(e) => onBtnEnter(e.currentTarget)} onMouseLeave={(e) => onBtnLeave(e.currentTarget)}
            style={{ padding: "10px 20px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,8,0,0.85)", color: "rgba(255,255,255,0.6)", fontSize: "13px", cursor: noOptionSelected ? "not-allowed" : "pointer", fontFamily: "'Space Mono', monospace", fontWeight: 600, opacity: noOptionSelected ? 0.3 : 1, whiteSpace: "nowrap", backdropFilter: "blur(8px)" }}>
            Copier {count > 1 ? `${count} mdp` : "1 mdp"}
          </button>
        </div>

        {history.length > 0 && (
          <div style={{ background: "rgba(0,8,0,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden", backdropFilter: "blur(8px)" }}>
            <button onClick={() => setShowHistory((v) => !v)} style={{ width: "100%", padding: "14px 20px", background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Space Mono', monospace" }}>
              <span>Historique récent</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{history.length} entrée{history.length > 1 ? "s" : ""} {showHistory ? "▲" : "▼"}</span>
            </button>
            {showHistory && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {history.map((pw, i) => (
                  <div key={i} style={{ padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < history.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", gap: "12px" }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{pw}</span>
                    <button onClick={() => copyToClipboard(pw)} onMouseEnter={(e) => onBtnEnter(e.currentTarget)} onMouseLeave={(e) => onBtnLeave(e.currentTarget)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "rgba(255,255,255,0.4)", padding: "4px 10px", fontSize: "10px", cursor: "pointer", fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>COPIER</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p ref={footerRef} style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "12px", marginTop: "24px", fontFamily: "'Space Mono', monospace", opacity: 0 }}>
          Généré localement • Aucune donnée envoyée
        </p>
      </div>
    </div>
  );
}