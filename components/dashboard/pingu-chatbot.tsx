"use client"
import { useState } from "react"

export default function PinguChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Assalam o Alaikum! Main Pingu hoon 🐧 Aaj kya khana hai? Koi bhi sawaal puchein!" }
  ])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMsg] })
    })
    const data = await res.json()
    setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
    setLoading(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-orange-100 flex flex-col overflow-hidden">
          <div className="bg-orange-500 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">🐧 Pingu Chef</span>
            <button onClick={() => setOpen(false)} className="text-white opacity-70 hover:opacity-100">✕</button>
          </div>
          <div className="flex-1 p-3 space-y-2 max-h-72 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm p-2 rounded-xl max-w-[90%] ${
                m.role === "user" ? "ml-auto bg-orange-100 text-orange-900" : "bg-gray-100 text-gray-800"
              }`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400 italic">Pingu soch raha hai...</div>}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Kuch puchein..."
              className="flex-1 text-sm border rounded-lg px-3 py-2 outline-none focus:border-orange-400"
            />
            <button onClick={send} className="bg-orange-500 text-white px-3 py-2 rounded-lg text-sm">Send</button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-orange-500 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
      >
        🐧
      </button>
    </div>
  )
}