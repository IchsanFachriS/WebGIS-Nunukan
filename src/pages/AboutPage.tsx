import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  institution: string;
  type: 'dosen' | 'mahasiswa';
  photo?: string;
}

const AboutPage: React.FC = () => {
  const teamMembers: TeamMember[] = [
    // Tim Dosen
    {
      name: 'Esa Fajar Hidayat, S.Kel., M.Si',
      role: 'Ketua Tim',
      institution: 'Ilmu Kelautan UB',
      type: 'dosen',
    },
    {
      name: 'Dr. Prima Roza, S.E., M.Ed. Admin.',
      role: 'Anggota Tim',
      institution: 'Ilmu-Ilmu Kemanusiaan FSRD ITB',
      type: 'dosen',
    },
    {
      name: 'Miga Magenika Julian, S.T, M.T.',
      role: 'Anggota Tim',
      institution: 'KK Hidrografi FITB ITB',
      type: 'dosen',
    },
    // Tim Mahasiswa
    {
      name: 'Wulan Larisa Olivia',
      role: 'Mahasiswa',
      institution: 'Teknik Geodesi dan Geomatika – ITB',
      type: 'mahasiswa',
    },
    {
      name: 'Ichsan Fachri Siroj',
      role: 'Mahasiswa',
      institution: 'Teknik Geodesi dan Geomatika – ITB',
      type: 'mahasiswa',
    },
    {
      name: 'Desvi Prasanti',
      role: 'Mahasiswa',
      institution: 'Ilmu Kelautan – UB',
      type: 'mahasiswa',
    },
    {
      name: 'Alena Cansery',
      role: 'Mahasiswa',
      institution: 'Teknik Geodesi dan Geomatika – ITB',
      type: 'mahasiswa',
    },
  ];

  const dosenMembers = teamMembers.filter(m => m.type === 'dosen');
  const mahasiswaMembers = teamMembers.filter(m => m.type === 'mahasiswa');

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-teal-800 to-slate-900 text-white py-16 px-4 border-b border-teal-500/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl shadow-2xl mb-6 border border-teal-400/30">
            <svg className="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Tentang SPACEMANGROVE</h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Program Pengabdian Masyarakat Pemetaan Mangrove di Nunukan, Kalimantan Utara
          </p>
        </div>
      </div>

      {/* Tujuan Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-16 border border-teal-500/20">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Tujuan Program</h2>
          </div>
          
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p className="text-lg">
              Program SPACEMANGROVE merupakan kegiatan pengabdian masyarakat yang bertujuan untuk:
            </p>
            
            <ul className="space-y-3 ml-6">
              <li className="flex items-start">
                <span className="text-teal-400 font-bold mr-3">•</span>
                <span>Memetakan dan mendokumentasikan persebaran hutan mangrove di wilayah Nunukan, Kalimantan Utara menggunakan teknologi WebGIS modern</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-400 font-bold mr-3">•</span>
                <span>Meningkatkan kesadaran masyarakat lokal tentang pentingnya ekosistem mangrove dan upaya konservasinya</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-400 font-bold mr-3">•</span>
                <span>Menyediakan data spasial yang akurat dan dapat diakses oleh pemangku kepentingan untuk mendukung pengambilan keputusan terkait pengelolaan mangrove</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-400 font-bold mr-3">•</span>
                <span>Membangun kapasitas masyarakat dalam pemanfaatan teknologi geospasial untuk monitoring lingkungan</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-400 font-bold mr-3">•</span>
                <span>Mendukung upaya pelestarian dan rehabilitasi ekosistem mangrove di wilayah pesisir Nunukan</span>
              </li>
            </ul>

            <p className="text-lg mt-6 pt-6 border-t border-slate-700/50">
              Melalui platform WebGIS ini, diharapkan dapat tercipta sistem monitoring mangrove yang berkelanjutan 
              dan memberikan manfaat jangka panjang bagi masyarakat Nunukan dalam menjaga kelestarian lingkungan pesisir.
            </p>
          </div>
        </div>

        {/* Tim Penyusun Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Tim Penyusun</h2>
            <p className="text-slate-400">Tim pengabdian masyarakat yang terlibat dalam program ini</p>
          </div>

          {/* Tim Dosen */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center tracking-tight">
              <span className="w-2 h-8 bg-gradient-to-b from-teal-400 to-blue-500 rounded-full mr-3"></span>
              Tim Dosen
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {dosenMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 overflow-hidden group border border-slate-700/50 hover:border-teal-500/50"
                >
                  {/* Photo Placeholder */}
                  <div className="relative h-64 bg-gradient-to-br from-teal-600 to-blue-700 flex items-center justify-center overflow-hidden">
                    <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Dosen
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-white mb-2 tracking-tight">{member.name}</h4>
                    <p className="text-sm text-teal-400 font-semibold mb-1">{member.role}</p>
                    <p className="text-sm text-slate-400">{member.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tim Mahasiswa */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center tracking-tight">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full mr-3"></span>
              Tim Mahasiswa
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mahasiswaMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden group border border-slate-700/50 hover:border-blue-500/50"
                >
                  {/* Photo Placeholder */}
                  <div className="relative h-56 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center overflow-hidden">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Mahasiswa
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-base font-bold text-white mb-1 tracking-tight">{member.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{member.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;