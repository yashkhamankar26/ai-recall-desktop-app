import { useState } from 'react'
import Markdown from 'react-markdown'

function App() {
  const [notes, setNotes] = useState([])
  const [path, setPath] = useState('')
  const [selectedNoteContent, setSelectedNoteContent] = useState('')
  const [activeNote, setActiveNote] = useState(null) 

  const handleSelectFolder = async () => {
    const selectedPath = await window.api.selectFolder()
    if (selectedPath) {
      setPath(selectedPath)
    }
  }

  const loadNotes = async () => {
    if (!path) {
      alert("Pehle folder select karein!")
      return
    }
    const files = await window.api.getObsidianNotes(path)
    setNotes(files)
    setSelectedNoteContent('') 
    setActiveNote(null)
  }

  const handleNoteClick = async (fileName) => {
    setActiveNote(fileName)
    const content = await window.api.readFileContent(path, fileName)
    setSelectedNoteContent(content)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f0f', color: '#e0e0e0' }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{ width: '320px', background: '#161616', borderRight: '1px solid #222', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🧠 AI Recall
        </h2>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input 
            type="text" value={path} readOnly placeholder="Select Vault 📁"
            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', background: '#202020', color: '#aaa', border: '1px solid #333', fontSize: '13px', outline: 'none' }}
          />
          <button 
            onClick={handleSelectFolder} 
            style={{ background: '#202020', border: '1px solid #333', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', color: '#fff' }}
          >
            📁
          </button>
        </div>
        
        <button 
          onClick={loadNotes} 
          style={{ width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.background = '#2563eb'}
        >
          Load Notes
        </button>

        <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0 0', overflowY: 'auto', flex: 1 }}>
          {notes.map((note, index) => (
            <li 
              key={index} 
              onClick={() => handleNoteClick(note)}
              style={{ 
                padding: '10px 12px', 
                marginBottom: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                borderRadius: '6px',
                background: activeNote === note ? '#1d4ed822' : 'transparent',
                color: activeNote === note ? '#60a5fa' : '#9ca3af',
                border: activeNote === note ? '1px solid #1d4ed844' : '1px solid transparent',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              📄 {note}
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT MAIN AREA */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#0f0f0f' }}>
        {selectedNoteContent ? (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ borderBottom: '1px solid #222', paddingBottom: '15px', marginBottom: '25px', fontSize: '26px', color: '#60a5fa', fontWeight: '600' }}>
              {activeNote}
            </h1>
            <div style={{ lineHeight: '1.7', fontSize: '16px', color: '#d1d5db' }}>
              <Markdown>{selectedNoteContent}</Markdown>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
            <h3 style={{ fontWeight: 'normal' }}>Select a note from the left sidebar to start reading...</h3>
          </div>
        )}
      </div>

    </div>
  )
}

export default App