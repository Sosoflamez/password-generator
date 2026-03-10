"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { generatePassword, evaluateStrength, calculateEntropy, type PasswordOptions } from "@/lib/password";
import { DEFAULT_OPTIONS } from "../utils/constants";
import MatrixBackground from "./MatrixBackground";
import PasswordDisplay from "./PasswordDisplay";
import StrengthBar from "./StrengthBar";
import OptionsGrid from "./OptionsGrid";
import MultipleGenerator from "./MultipleGenerator";
import HistoryPanel from "./HistoryPanel";

let gsap: typeof import("gsap").gsap | null = null;

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
  const noOptionSelected = !options.lowercase && !options.uppercase && !options.numbers && !options.symbols;
  const strength = evaluateStrength(password, options);
  const entropy = calculateEntropy(password, options);

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

      <MatrixBackground />

      <div style={{ width: "100%", maxWidth: "520px", position: "relative", zIndex: 2 }}>

        {/* Header */}
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

        {/* Card */}
        <div ref={cardRef} style={{ background: "rgba(0,8,0,0.85)", border: "1px solid rgba(0,255,65,0.15)", borderRadius: "20px", padding: "28px", marginBottom: "16px", opacity: 0, backdropFilter: "blur(12px)" }}>
          <PasswordDisplay
            password={password}
            copied={copied}
            noOptionSelected={noOptionSelected}
            onGenerate={generate}
            onCopy={() => copyToClipboard(password)}
            passwordDisplayRef={passwordDisplayRef}
            passwordTextRef={passwordTextRef}
            onBtnEnter={onBtnEnter}
            onBtnLeave={onBtnLeave}
          />

          {password && !noOptionSelected && (
            <StrengthBar
              entropy={entropy}
              strength={strength}
              strengthBarRef={strengthBarRef}
            />
          )}

          {/* Slider longueur */}
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

          <OptionsGrid
            options={options}
            optionsRef={optionsRef}
            onChange={onOptionChange}
          />
        </div>

        {/* Bouton principal */}
        <button
          ref={generateBtnRef}
          onClick={generate}
          disabled={noOptionSelected}
          onMouseEnter={(e) => { if (!noOptionSelected && gsap) gsap.to(e.currentTarget, { y: -3, scale: 1.02, boxShadow: "0 12px 40px rgba(0,255,65,0.4)", duration: 0.2, ease: "power2.out" }); }}
          onMouseLeave={(e) => { if (gsap) gsap.to(e.currentTarget, { y: 0, scale: 1, boxShadow: "0 4px 20px rgba(0,255,65,0.15)", duration: 0.3, ease: "power3.out" }); }}
          onMouseDown={(e) => { if (gsap) gsap.to(e.currentTarget, { scale: 0.97, duration: 0.1 }); }}
          onMouseUp={(e) => { if (gsap) gsap.to(e.currentTarget, { scale: 1.02, duration: 0.15 }); }}
          style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid rgba(0,255,65,0.4)", background: noOptionSelected ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, rgba(0,255,65,0.9), rgba(0,200,50,0.85))", color: noOptionSelected ? "rgba(255,255,255,0.2)" : "#000", fontSize: "15px", fontWeight: 700, fontFamily: "'Space Mono', monospace", letterSpacing: "1px", cursor: noOptionSelected ? "not-allowed" : "pointer", boxShadow: noOptionSelected ? "none" : "0 4px 20px rgba(0,255,65,0.15)", marginBottom: "12px", opacity: 0 }}
        >
          GÉNÉRER UN NOUVEAU MOT DE PASSE
        </button>

        <MultipleGenerator
          countStr={countStr}
          count={count}
          noOptionSelected={noOptionSelected}
          multipleRef={multipleRef}
          onCountChange={setCountStr}
          onCountBlur={() => setCountStr(String(Math.min(20, Math.max(1, parseInt(countStr) || 1))))}
          onGenerate={generateMultiple}
          onBtnEnter={onBtnEnter}
          onBtnLeave={onBtnLeave}
        />

        <HistoryPanel
          history={history}
          showHistory={showHistory}
          onToggle={() => setShowHistory((v) => !v)}
          onCopy={copyToClipboard}
          onBtnEnter={onBtnEnter}
          onBtnLeave={onBtnLeave}
        />

        <p ref={footerRef} style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "12px", marginTop: "24px", fontFamily: "'Space Mono', monospace", opacity: 0 }}>
          Généré localement • Aucune donnée envoyée
        </p>
        
      </div>
    </div>
  );
}