import { useState } from "react";
import Markdown from "react-markdown";

function App() {
  const [notes, setNotes] = useState([])
  const [path, setPath] = useState('')
  const [selectedNoteContent, setSelectedNoteContent] = useState('')
  const [activeNote, setActiveNote] = useState(null) // highlight karne ke liye

// 1 . folder select karne wala function
const handleSelectFolder = async () => {
  const SelectedPath = await window.api.selectFolder()
  if (SelectedPath) {
    setPath(SelectedPath) // text box me path set kar dega
  }
}

  //2. Notes load krne vala function
  const loadNotes = async () => {
    if(!path) {
      alert("first you put the Obsidian folder path")
      return
    }

    // window.api se preload wala functon call ho raha hai
    const files = await window.api.getObsidianNotes(path)
    setNotes(files)
    setSelectedNoteContent('') // clear old notes
    setActiveNote(null)
  }

  // new function for click the note its runing the function
  const handleNoteClick = async (fileName) => {
    setActiveNote(fileName)
    const content = await window.api.readFileContent(path, fileName)
    setSelectedNoteContent(content)
  }
 
 return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', color: '#eee', background: '#1e1e1e' }}>
      
      {/* 👈 LEFT SIDEBAR: Notes ki list */}
      <div style={{ width: '300px', borderRight: '1px solid #444', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginTop: 0 }}>🧠 AI Recall</h2>
        
        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
          <input 
            type="text" value={path} readOnly placeholder="Select Vault 📁"
            style={{ flex: 1, padding: '8px', borderRadius: '4px', background: '#333', color: 'white', border: '1px solid #555' }}
          />
          <button onClick={handleSelectFolder} style={{ cursor: 'pointer' }}>📁</button>
        </div>
        <button onClick={loadNotes} style={{ padding: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Load Notes
        </button>

        <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px', overflowY: 'auto' }}>
          {notes.map((note, index) => (
            <li 
              key={index} 
              onClick={() => handleNoteClick(note)}
              style={{ 
                padding: '10px', 
                borderBottom: '1px solid #333', 
                cursor: 'pointer',
                background: activeNote === note ? '#333' : 'transparent', // Jo open hai use highlight karo
                borderRadius: '4px'
              }}
            >
              📄 {note}
            </li>
          ))}
        </ul>
      </div>

      {/* 👉 RIGHT MAIN AREA: Note ka content */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#121212' }}>
        {selectedNoteContent ? (
          <div>
            <h1 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', color: '#4CAF50' }}>{activeNote}</h1>
            {/* React Markdown yahan raw text ko HTML (headings, bold) me convert karega */}
            <div style={{ lineHeight: '1.6', fontSize: '16px' }}>
              <Markdown>{selectedNoteContent}</Markdown>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            <h3>Left side se koi note select karein...</h3>
          </div>
        )}
      </div>

    </div>
  )
}
export default App