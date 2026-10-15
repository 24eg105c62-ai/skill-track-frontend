import React, { useState, useEffect } from 'react';
import { pdfApi } from '../api/pdfApi';
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Layers,
  Sparkles,
  Bookmark,
  Calendar,
  FileCheck,
  Tag
} from 'lucide-react';

export default function PdfSummarizer() {
  const [documents, setDocuments] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    setLoadingDocs(true);
    try {
      const docs = await pdfApi.getMyDocuments();
      setDocuments(docs || []);
      if (docs && docs.length > 0 && !selectedSummary) {
        // Automatically load most recent document's summary
        const summary = await pdfApi.getSummary(docs[0].id);
        setSelectedSummary(summary);
      }
    } catch (err) {
      console.error('Failed to load PDF documents', err);
    } finally {
      setLoadingDocs(false);
    }
  }

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files (.pdf) are permitted.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const summary = await pdfApi.uploadPdf(file);
      setSelectedSummary(summary);
      await loadDocuments();
    } catch (err) {
      setError(err.message || 'PDF processing and extraction failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectDoc = async (docId) => {
    try {
      const summary = await pdfApi.getSummary(docId);
      setSelectedSummary(summary);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load summary');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          PDF Technical Summarizer
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Extract text using Apache PDFBox, parse key concepts, chapter breakdowns, revision notes, and page references.
        </p>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        className="card"
        style={{
          padding: '2.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
          border: dragActive ? '2px dashed var(--primary)' : '2px dashed var(--border)',
          background: dragActive ? 'var(--primary-light)' : 'var(--bg-surface)',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
        }}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('pdf-file-input').click()}
      >
        <input
          id="pdf-file-input"
          type="file"
          accept=".pdf,application/pdf"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Upload size={28} />
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          {uploading ? 'Extracting Text with Apache PDFBox...' : 'Drop your technical PDF here, or click to browse'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Max file size 10MB • Strict magic-byte verified • Text extraction only (no OCR fabrication)
        </p>
      </div>

      {/* Main Split Layout: Document Sidebar & Detailed Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '1.75rem', alignItems: 'start' }}>
        
        {/* Left: Uploaded Documents List */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} style={{ color: 'var(--primary)' }} /> Uploaded Materials
          </h2>

          {loadingDocs ? (
            <div className="spinner" />
          ) : documents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No PDFs uploaded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {documents.map((doc) => {
                const isSelected = selectedSummary?.pdfId === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDoc(doc.id)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--primary-light)' : 'var(--bg-surface)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', color: isSelected ? 'var(--primary)' : 'var(--text-primary)', wordBreak: 'break-all' }}>
                      {doc.originalFilename}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{doc.pageCount} pages</span>
                      <span>{(doc.fileSizeBytes / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Structured Summary View */}
        {selectedSummary ? (
          <div className="card" style={{ padding: '2rem' }}>
            {/* Header info */}
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-purple">{selectedSummary.summaryType}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {selectedSummary.pageCount} Pages Processed
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                {selectedSummary.originalFilename}
              </h2>
            </div>

            {/* Overview */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} style={{ color: 'var(--primary)' }} /> Executive Overview
              </h3>
              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                {selectedSummary.overview}
              </div>
            </div>

            {/* Key Concepts */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={18} style={{ color: 'var(--purple)' }} /> Key Technical Concepts
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedSummary.keyConcepts?.map((concept, idx) => (
                  <span key={idx} className="badge badge-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Chapter Breakdown */}
            {selectedSummary.chapterBreakdown?.length > 0 && (
              <div style={{ marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={18} style={{ color: 'var(--info)' }} /> Chapter & Topic Breakdown
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedSummary.chapterBreakdown.map((ch, idx) => (
                    <div key={idx} style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ch.title}</span>
                        <span className="badge badge-purple">{ch.pageRange}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {ch.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Revision Notes */}
            {selectedSummary.revisionNotes?.length > 0 && (
              <div style={{ marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} style={{ color: 'var(--warning)' }} /> High-Yield Revision Notes
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedSummary.revisionNotes.map((note, idx) => (
                    <li key={idx} style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.88rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                      <CheckCircle size={16} style={{ color: 'var(--success)', marginTop: 2, flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Source References */}
            {selectedSummary.sourceReferences?.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bookmark size={18} style={{ color: 'var(--primary)' }} /> Source Page Citations
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {selectedSummary.sourceReferences.map((ref, idx) => (
                    <div key={idx} style={{ padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                        <span>{ref.topic}</span>
                        <span>Page {ref.pageNumber}</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.3 }}>
                        "{ref.excerpt}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card empty-state">
            <FileText size={48} className="empty-state-icon" />
            <h3>No Summary Selected</h3>
            <p>Upload a PDF document above to extract its technical concepts and structured breakdown.</p>
          </div>
        )}
      </div>
    </div>
  );
}
