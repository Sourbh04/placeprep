import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'

export default function FileUpload({ onFile, file, loading }) {
  const onDrop = useCallback((accepted) => {
    if (accepted[0]) onFile(accepted[0])
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: loading,
  })

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active' : ''}`}
      style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
    >
      <input {...getInputProps()} />
      <div className="dropzone-icon">{file ? '📄' : isDragActive ? '🎯' : '📂'}</div>
      {file ? (
        <>
          <h3 style={{ color: '#10b981' }}>File Selected!</h3>
          <p style={{ marginTop: 8 }}><strong style={{ color: '#f1f5f9' }}>{file.name}</strong></p>
          <p style={{ marginTop: 4, fontSize: 12 }}>{(file.size / 1024).toFixed(1)} KB · Click to change</p>
        </>
      ) : isDragActive ? (
        <>
          <h3>Drop it here!</h3>
          <p>Release to upload your resume</p>
        </>
      ) : (
        <>
          <h3>Drag & Drop your Resume</h3>
          <p style={{ marginTop: 8 }}>or <span style={{ color: '#a855f7', fontWeight: 600 }}>click to browse</span></p>
          <p style={{ marginTop: 8, fontSize: 12 }}>PDF only · Max 10MB</p>
        </>
      )}
      {loading && (
        <div style={{ marginTop: 16 }}>
          <div className="spinner" />
          <p style={{ marginTop: 12, color: '#a855f7' }}>Analyzing with AI... this may take a moment ✨</p>
        </div>
      )}
    </div>
  )
}
