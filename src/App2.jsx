import { useMemo, useRef, useState, useEffect } from "react";

const CHARACTERS = {
  Professor: { icon: "🎓", name: "Professor Elm", short: "Professor", className: "prof" },
  Detective: { icon: "🔎", name: "Detective Vale", short: "Detective", className: "det" },
  Sceptic: { icon: "🤨", name: "The Sceptic", short: "Sceptic", className: "scep" },
  Mischief: { icon: "😈", name: "Mischief", short: "Mischief", className: "misch" },
  Tutor: { icon: "🌿", name: "Tutor Moss", short: "Tutor", className: "tutor" },
};

function characterFromText(text) {
  const t = text.toLowerCase();
  if (t.includes("mischief")) return "Mischief";
  if (t.includes("detective") || t.includes("vale")) return "Detective";
  if (t.includes("sceptic") || t.includes("skeptic")) return "Sceptic";
  if (t.includes("tutor") || t.includes("moss")) return "Tutor";
  if (t.includes("professor") || t.includes("elm")) return "Professor";
  return null;
}

function Bubble({ message }) {
  if (message.role === "user") return <div className="userBubble">{message.content}</div>;
  const c = CHARACTERS[message.character] || CHARACTERS.Professor;
  return (
    <div className={`aiBubble ${c.className}`}>
      <div className="speaker">{c.icon} {c.name}</div>
      <div className="body">{message.content}</div>
    </div>
  );
}

export default function App() {
  const [topic, setTopic] = useState("");
  const [caseTopic, setCaseTopic] = useState("");
  const [active, setActive] = useState("Professor");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const inCase = !!caseTopic;

  async function callClub({ userText, character = active, action = "chat", nextMessages = messages }) {
    setLoading(true);
    setError("");
    try {
      const history = nextMessages.slice(-20).map(m => ({
        role: m.role,
        content: m.content,
        character: m.character || undefined,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: caseTopic || topic,
          character,
          action,
          message: userText,
          history,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);

      setMessages(prev => [...prev, {
        role: "assistant",
        character: data.character || character,
        content: data.reply || "I lost my train of thought. Try me again.",
      }]);
    } catch (e) {
      setError(e.message || "The club couldn't reach its AI brain.");
    } finally {
      setLoading(false);
    }
  }

  async function openCase() {
    const t = topic.trim();
    if (!t || loading) return;
    setCaseTopic(t);
    setMessages([]);
    setActive("Professor");
    setError("");
    setTimeout(() => {
      callClub({
        userText: `Open the discussion about: ${t}`,
        character: "Professor",
        action: "open",
        nextMessages: [],
      });
    }, 0);
  }

  async function summon(character) {
    if (!inCase || loading) return;
    setActive(character);
    await callClub({
      userText: `You have been summoned. Join the current discussion about "${caseTopic}".`,
      character,
      action: "summon",
    });
  }

  async function send() {
    const t = input.trim();
    if (!t || loading) return;
    setInput("");

    const summoned = characterFromText(t);
    const chosen = summoned || active;
    if (summoned) setActive(summoned);

    const userMsg = { role: "user", content: t };
    const next = [...messages, userMsg];
    setMessages(next);

    const lower = t.toLowerCase();
    let action = "chat";
    if (/(give|show|tell).*(answer)|i give up|what'?s the answer|just tell me/.test(lower)) action = "answer";
    else if (/bigger (clue|hint)|more help/.test(lower)) action = "big_clue";
    else if (/\b(clue|hint)\b/.test(lower)) action = "clue";

    await callClub({ userText: t, character: chosen, action, nextMessages: next });
  }

  async function quick(action) {
    if (!inCase || loading) return;
    const character = action === "answer" ? "Professor" : "Tutor";
    setActive(character);
    await callClub({
      userText:
        action === "clue" ? "Give me a clue." :
        action === "big_clue" ? "Give me a bigger clue." :
        "Give me the answer now.",
      character,
      action,
    });
  }

  function newTopic() {
    setCaseTopic("");
    setTopic("");
    setMessages([]);
    setInput("");
    setError("");
    setActive("Professor");
  }

  return (
    <>
      <header>
        <div>
          <div className="brand">🧠 The Thinking Club <span className="badge">LIVE AI</span></div>
          <div className="subtitle">Summon the way you want to think</div>
        </div>
        <div className="potato">🥔</div>
      </header>

      <main>
        {!inCase ? (
          <section className="startCard">
            <h1>Bring us anything.</h1>
            <p>A question, claim, puzzle, argument, idea, homework problem, strange thought — whatever you want to explore.</p>
            <div className="startRow">
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && openCase()}
                placeholder="e.g. prayer, 5 + 5, black holes, is this claim true?"
              />
              <button className="primary" onClick={openCase} disabled={loading}>Enter club</button>
            </div>
            <div className="examples">
              <button onClick={() => setTopic("Could a T. rex swim?")}>Could a T. rex swim?</button>
              <button onClick={() => setTopic("Prayer")}>Prayer</button>
              <button onClick={() => setTopic("5 + 5")}>5 + 5</button>
              <button onClick={() => setTopic("Social media makes people less social")}>Challenge a claim</button>
            </div>
          </section>
        ) : (
          <section className="club">
            <div className="caseTop">
              <span>TOPIC: <strong>{caseTopic}</strong></span>
              <button onClick={newTopic}>← New topic</button>
            </div>

            <div className="characterBar">
              {Object.entries(CHARACTERS).map(([key, c]) => (
                <button
                  key={key}
                  className={active === key ? "active" : ""}
                  onClick={() => summon(key)}
                  disabled={loading}
                  title={`Bring out ${c.name}`}
                >
                  <span>{c.icon}</span><small>{c.short}</small>
                </button>
              ))}
            </div>

            <div className="chat">
              {messages.map((m, i) => <Bubble key={i} message={m} />)}
              {loading && (
                <div className={`aiBubble ${CHARACTERS[active].className} thinking`}>
                  <div className="speaker">{CHARACTERS[active].icon} {CHARACTERS[active].name}</div>
                  <div className="body">Thinking…</div>
                </div>
              )}
              {error && <div className="error">{error}</div>}
              <div ref={endRef} />
            </div>

            <div className="dock">
              <div className="quickRow">
                <button onClick={() => quick("clue")} disabled={loading}>💡 Clue</button>
                <button onClick={() => quick("big_clue")} disabled={loading}>🔎 Bigger clue</button>
                <button className="answer" onClick={() => quick("answer")} disabled={loading}>👀 Show answer</button>
              </div>
              <div className="composer">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder={`Talk to ${CHARACTERS[active].name}…`}
                />
                <button className="send" onClick={send} disabled={loading}>➤</button>
              </div>
              <div className="tip">
                You can also type “bring out Mischief”, “Detective, check that”, or “give me the answer”.
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

