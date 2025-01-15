import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import CodeMirror from '@uiw/react-codemirror' // Use the default export
import 'codemirror/theme/base16-light.css'
import { oneDark } from '@codemirror/theme-one-dark'
import { markdown } from '@codemirror/lang-markdown'
import { setPendingSync } from '@/slices/sync'
import { updateNote } from '@/slices/note'
import { getActiveNote } from '@/utils/helpers'
import { NoteItem } from '@/types'
import { NoteMenuBar } from '@/containers/NoteMenuBar'
import { EmptyEditor } from '@/components/Editor/EmptyEditor'
import { PreviewEditor } from '@/components/Editor/PreviewEditor'
import { getNotes, getSettings, getSync } from '@/selectors'

import 'codemirror/theme/base16-light.css'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/scroll/scrollpastend'

export const NoteEditor: React.FC = () => {
  // =========================================================================== 
  // Selectors 
  // ===========================================================================

  const { pendingSync } = useSelector(getSync)
  const { activeNoteId, loading, notes } = useSelector(getNotes)
  const { codeMirrorOptions, previewMarkdown } = useSelector(getSettings)

  const activeNote = getActiveNote(notes, activeNoteId)

  // =========================================================================== 
  // Dispatch 
  // ===========================================================================

  const dispatch = useDispatch()

  const _updateNote = (note: NoteItem) => {
    if (!pendingSync) dispatch(setPendingSync())
    dispatch(updateNote(note))
  }

  const [editorValue, setEditorValue] = useState(activeNote?.text || '')

  const handleEditorChange = (value: string) => {
    setEditorValue(value)
    if (activeNote) {
      _updateNote({
        id: activeNote.id,
        text: value,
        created: activeNote.created,
        lastUpdated: dayjs().format(),
      })
    }
  }

  const renderEditor = () => {
    if (loading) {
      return <div className="empty-editor v-center">Loading...</div>
    } else if (!activeNote) {
      return <EmptyEditor />
    } else if (previewMarkdown) {
      return (
        <PreviewEditor
          directionText={codeMirrorOptions.direction}
          noteText={activeNote.text}
          notes={notes}
        />
      )
    }

    return (
      <CodeMirror
        value={editorValue}
        height="100%"
        theme="light"
        extensions={[
          markdown(),
          // Any other extensions you need can go here
        ]}
        onChange={handleEditorChange}
        {...codeMirrorOptions} // Apply other options like direction, etc.
      />
    )
  }

  return (
    <main className="note-editor">
      <NoteMenuBar />
      {renderEditor()}
    </main>
  )
}