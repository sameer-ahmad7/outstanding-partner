import { useAppState } from '../../state/AppStateProvider.jsx';

export default function RemindersTab() {
  const scope = useAppState();
  const {
    getToday,
    phase,
    setSheSaid,
    setSheSaidDone,
    setSheSaidInput,
    sheSaid,
    sheSaidDone,
    sheSaidInput,
  } = scope;

  return (
    <div>
                <div style={{
        fontSize: 12,
        color: "#555",
        lineHeight: 1.6,
        marginBottom: 14
      }}>Capture what she mentions — her dreams, things she wants, what she's worried about. Use it to show her you listen.</div>
                <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 16
      }}>
                  <input value={sheSaidInput} onChange={e => setSheSaidInput(e.target.value)} onKeyDown={e => {
          if (e.key === "Enter" && sheSaidInput.trim()) {
            setSheSaid(p => [{
              text: sheSaidInput.trim(),
              date: getToday(),
              phase: phase.label
            }, ...p].slice(0, 100));
            setSheSaidInput("");
          }
        }} placeholder="She just said something..." style={{
          flex: 1,
          background: "#1a1a1a",
          border: "1px solid #333",
          color: "#f0ece4",
          borderRadius: 10,
          padding: "11px 14px",
          fontSize: 13,
          fontFamily: "inherit"
        }} />
                  <button onClick={() => {
          if (sheSaidInput.trim()) {
            setSheSaid(p => [{
              text: sheSaidInput.trim(),
              date: getToday(),
              phase: phase.label
            }, ...p].slice(0, 100));
            setSheSaidInput("");
          }
        }} style={{
          background: "#c0392b",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "11px 16px",
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer"
        }}>+</button>
                </div>
                {sheSaid.length === 0 ? <div style={{
        textAlign: "center",
        padding: "40px 20px",
        color: "#333"
      }}>
                    <div style={{
          fontSize: 32,
          marginBottom: 10
        }}>📝</div>
                    <div style={{
          fontSize: 13,
          color: "#555",
          lineHeight: 1.6
        }}>Nothing saved yet. When she mentions a restaurant, a dream, something she wants — capture it here. These become your secret weapon.</div>
                  </div> : sheSaid.map((s, i) => {
        const done = sheSaidDone && sheSaidDone.includes(i);
        return <div key={i} style={{
          background: "#1a1a1a",
          border: `1px solid ${done ? "#27ae6030" : "#2a2a2a"}`,
          borderRadius: 12,
          padding: "12px 14px",
          marginBottom: 8
        }}>
                      <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 8
          }}>
                        <div style={{
              flex: 1,
              fontSize: 13,
              color: done ? "#666" : "#f0ece4",
              textDecoration: done ? "line-through" : "none",
              lineHeight: 1.5
            }}>{s.text}</div>
                        <button onClick={() => setSheSaid(p => p.filter((_, j) => j !== i))} style={{
              background: "transparent",
              border: "none",
              color: "#333",
              fontSize: 14,
              cursor: "pointer",
              flexShrink: 0
            }}>✕</button>
                      </div>
                      <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
                        <div style={{
              fontSize: 10,
              color: "#444"
            }}>{s.date} · {s.phase}</div>
                        <button onClick={() => setSheSaidDone && setSheSaidDone(p => done ? p.filter(x => x !== i) : [...p, i])} style={{
              background: "transparent",
              border: `1px solid ${done ? "#27ae6060" : "#333"}`,
              borderRadius: 6,
              padding: "3px 10px",
              fontSize: 11,
              color: done ? "#27ae60" : "#555",
              cursor: "pointer"
            }}>
                          {done ? "✓ Done" : "→ Act on this"}
                        </button>
                      </div>
                    </div>;
      })}
              </div>
  );
}
