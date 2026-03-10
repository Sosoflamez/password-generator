import { MATRIX_COLUMNS } from "../utils/constants";

export default function MatrixBackground() {
    return (
        <>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            >
                {[0, 1, 2, 3, 4].map((patternIdx) => (
                    <div
                        key={patternIdx}
                        style={{
                            position: "relative",
                            width: "1000px",
                            height: "100%",
                            flexShrink: 0,
                        }}
                    >
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
                                    background:
                                        "linear-gradient(to bottom, #ffffff 0%, #ffffff 5%, #00ff41 10%, #00ff41 20%, #00dd33 30%, #00bb22 40%, #009911 50%, #007700 60%, #005500 70%, #003300 80%, rgba(0,255,65,0.5) 90%, transparent 100%)",
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

            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.88) 100%)",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />
        </>
    );
}
