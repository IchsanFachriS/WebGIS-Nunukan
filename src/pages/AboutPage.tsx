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
      institution: 'Ilmu-Ilmu Kemanusiaan PSDKU',
      type: 'dosen',
    },
    {
      name: 'Miga Magenika Julian, S.T, M.T.',
      role: 'Anggota Tim',
      institution: 'Kit Hidrogren FITB',
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
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-4">Tentang SPACEMANGROVE</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Program Pengabdian Masyarakat Pemetaan Mangrove di Nunukan, Kalimantan Utara
          </p>
        </div>
      </div>

      {/* Tujuan Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-16">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Tujuan Program</h2>
          </div>
          
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg">
              Program SPACEMANGROVE merupakan kegiatan pengabdian masyarakat yang bertujuan untuk:
            </p>
            
            <ul className="space-y-3 ml-6">
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-3">•</span>
                <span>Memetakan dan mendokumentasikan persebaran hutan mangrove di wilayah Nunukan, Kalimantan Utara menggunakan teknologi WebGIS modern</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-3">•</span>
                <span>Meningkatkan kesadaran masyarakat lokal tentang pentingnya ekosistem mangrove dan upaya konservasinya</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-3">•</span>
                <span>Menyediakan data spasial yang akurat dan dapat diakses oleh pemangku kepentingan untuk mendukung pengambilan keputusan terkait pengelolaan mangrove</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-3">•</span>
                <span>Membangun kapasitas masyarakat dalam pemanfaatan teknologi geospasial untuk monitoring lingkungan</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-3">•</span>
                <span>Mendukung upaya pelestarian dan rehabilitasi ekosistem mangrove di wilayah pesisir Nunukan</span>
              </li>
            </ul>

            <p className="text-lg mt-6 pt-6 border-t border-gray-200">
              Melalui platform WebGIS ini, diharapkan dapat tercipta sistem monitoring mangrove yang berkelanjutan 
              dan memberikan manfaat jangka panjang bagi masyarakat Nunukan dalam menjaga kelestarian lingkungan pesisir.
            </p>
          </div>
        </div>

        {/* Tim Penyusun Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">Tim Penyusun</h2>
            <p className="text-gray-600">Tim pengabdian masyarakat yang terlibat dalam program ini</p>
          </div>

          {/* Tim Dosen */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-emerald-600 rounded-full mr-3"></span>
              Tim Dosen
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {dosenMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Photo Placeholder */}
                  <div className="relative h-64 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden">
                    <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Dosen
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{member.name}</h4>
                    <p className="text-sm text-emerald-600 font-semibold mb-1">{member.role}</p>
                    <p className="text-sm text-gray-600">{member.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tim Mahasiswa */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
              Tim Mahasiswa
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mahasiswaMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Photo Placeholder */}
                  <div className="relative h-56 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center overflow-hidden">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Mahasiswa
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-base font-bold text-gray-800 mb-1">{member.name}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{member.institution}</p>
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