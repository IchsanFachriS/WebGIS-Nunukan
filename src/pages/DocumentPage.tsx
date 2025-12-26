import React from 'react';

interface Document {
  id: string;
  title: string;
  description: string;
  filename: string;
  size: string;
  date: string;
}

const DocumentPage: React.FC = () => {
  const documents: Document[] = [
    {
      id: '1',
      title: 'Modul Pengabdian Masyarakat',
      description: 'Modul lengkap mengenai kegiatan pengabdian masyarakat pemetaan mangrove di Nunukan, Kalimantan Utara',
      filename: 'Modul_Pengabdian_Masyarakat.pdf',
      size: '2.5 MB',
      date: 'Desember 2024',
    },
  ];

  const handleDownload = (filename: string) => {
    const link = document.createElement('a');
    link.href = `./documents/${filename}`;
    link.download = filename;
    link.click();
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl shadow-2xl mb-4 border border-teal-400/30">
            <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Dokumen</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Koleksi dokumen terkait kegiatan pengabdian masyarakat dan pemetaan mangrove
          </p>
        </div>

        {/* Document Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 overflow-hidden group border border-slate-700/50 hover:border-teal-500/50"
            >
              {/* Document Icon Header */}
              <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 p-8 flex items-center justify-center border-b border-slate-700/50">
                <div className="relative">
                  <svg className="w-20 h-20 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                    <path d="M14 2v6h6" fill="rgba(30, 41, 59, 0.8)" />
                    <path d="M9 13h6M9 17h6" stroke="rgba(30, 41, 59, 0.8)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                    PDF
                  </div>
                </div>
              </div>

              {/* Document Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors tracking-tight">
                  {doc.title}
                </h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                  {doc.description}
                </p>

                {/* Document Meta */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {doc.date}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {doc.size}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(doc.filename)}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-teal-500/30 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Unduh
                  </button>
                  <button
                    onClick={() => window.open(`./documents/${doc.filename}`, '_blank')}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center border border-slate-600/50"
                    title="Lihat"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {documents.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-800/50 backdrop-blur-sm rounded-full mb-6 border border-slate-700/50">
              <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Belum Ada Dokumen</h3>
            <p className="text-slate-400">Dokumen akan segera ditambahkan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentPage;