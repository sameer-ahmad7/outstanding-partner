import { useAppState } from '../../state/AppStateProvider.jsx';

export default function LogTab() {
  const scope = useAppState();
  const {
    currentStreak,
    taskLog,
  } = scope;

  return (
    <div>
                {/* Monthly score */}
                {(() => {
        const now = new Date();
        const mk = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const mLog = taskLog.filter(l => l.date && l.date.startsWith(mk));
        const avg = mLog.length > 0 ? (mLog.reduce((s, l) => s + (l.rating || 3), 0) / mLog.length).toFixed(1) : null;
        const score = mLog.length > 0 ? Math.round((parseFloat(avg) / 5 * 0.6 + Math.min(mLog.length / 20, 1) * 0.4) * 100) : 0;
        const level = score >= 85 ? "Elite Partner 👑" : score >= 70 ? "Advanced 🔥" : score >= 55 ? "Consistent 💪" : score >= 40 ? "Building 🌱" : "Getting Started";
        const color = score >= 85 ? "#f1c40f" : score >= 70 ? "#27ae60" : score >= 55 ? "#3498db" : score >= 40 ? "#e67e22" : "#888";
        return <div style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 14,
          padding: 18,
          marginBottom: 16
        }}>
                      <div style={{
            fontSize: 10,
            color: "#666",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 12
          }}>This Month</div>
                      <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 10
          }}>
                        <div>
                          <div style={{
                fontSize: 48,
                fontWeight: 900,
                color,
                fontFamily: "'Playfair Display',serif",
                lineHeight: 1
              }}>{score}</div>
                          <div style={{
                fontSize: 12,
                color,
                fontWeight: 700,
                marginTop: 4
              }}>{level}</div>
                        </div>
                        <div style={{
              textAlign: "right",
              fontSize: 11,
              color: "#555"
            }}>
                          <div>{mLog.length} days logged</div>
                          <div>{currentStreak} day streak</div>
                          {avg && <div>{avg}★ avg</div>}
                        </div>
                      </div>
                      <div style={{
            background: "#2a2a2a",
            borderRadius: 4,
            height: 5,
            overflow: "hidden"
          }}>
                        <div style={{
              width: `${score}%`,
              height: "100%",
              background: color,
              borderRadius: 4
            }} />
                      </div>
                    </div>;
      })()}
    
                {/* Log history */}
                {taskLog.length === 0 ? <div style={{
        textAlign: "center",
        padding: "30px 0",
        color: "#444"
      }}>
                    <div style={{
          fontSize: 28,
          marginBottom: 8
        }}>📓</div>
                    <div style={{
          fontSize: 13,
          color: "#555"
        }}>No entries yet. Mark missions done on Today to build your log.</div>
                  </div> : taskLog.slice(0, 20).map((l, i) => <div key={i} style={{
        background: "#1a1a1a",
        borderRadius: 10,
        padding: "10px 14px",
        marginBottom: 8,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
                    <div>
                      <div style={{
            fontSize: 12,
            color: "#ddd",
            lineHeight: 1.4,
            marginBottom: 2
          }}>{l.task}</div>
                      <div style={{
            fontSize: 10,
            color: "#555"
          }}>{l.date} · {l.phase}</div>
                    </div>
                    <div style={{
          fontSize: 13,
          color: "#f1c40f",
          flexShrink: 0,
          marginLeft: 10
        }}>{"★".repeat(l.rating || 3)}</div>
                  </div>)}
              </div>
  );
}
