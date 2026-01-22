import React from 'react';
import { Trees, TrendingUp, AlertTriangle, Leaf } from 'lucide-react';

interface SpeciesData {
  id: number;
  name: string;
  scientificName: string;
  image: string;
  carbonStorage: number;
  height: string;
  habitat: string;
  status: 'Stabil' | 'Perlu Perhatian' | 'Terancam';
  description: string;
  zone: string;
}

const SpeciesCarbonPage: React.FC = () => {
  const speciesData: SpeciesData[] = [
    {
      id: 1,
      name: 'Bakau Minyak',
      scientificName: 'Rhizophora apiculata',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400',
      carbonStorage: 25,
      height: '20-25 meter',
      habitat: 'Zona Tengah',
      status: 'Stabil',
      description: 'Spesies mangrove dengan akar tunjang kuat, sering ditemukan di zona tengah. Kayunya digunakan untuk bahan bangunan.',
      zone: 'Zona Tengah'
    },
    {
      id: 2,
      name: 'Bakau Hitam',
      scientificName: 'Rhizophora mucronata',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
      carbonStorage: 27,
      height: '25-30 meter',
      habitat: 'Zona Tengah',
      status: 'Stabil',
      description: 'Memiliki akar tunjang besar, tumbuh di tanah berlumpur dalam. Buah propagul digunakan untuk penanaman.',
      zone: 'Zona Tengah'
    },
    {
      id: 3,
      name: 'Api-api bulu',
      scientificName: 'Avicennia lanata',
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400',
      carbonStorage: 22,
      height: '10-15 meter',
      habitat: 'Zona Depan',
      status: 'Stabil',
      description: 'Memiliki pneumatofor (akar nafas) rapat. Daun berbulu halus dan berwarna keperakan.',
      zone: 'Zona Depan'
    },
    {
      id: 4,
      name: 'Tumu',
      scientificName: 'Bruguiera gymnorhiza',
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400',
      carbonStorage: 20,
      height: '15-20 meter',
      habitat: 'Zona Tengah',
      status: 'Perlu Perhatian',
      description: 'Pohon dengan akar lutut khas, bunganya berwarna merah jingga. Kayunya dipakai untuk konstruksi.',
      zone: 'Zona Tengah'
    },
    {
      id: 5,
      name: 'Lenggadai',
      scientificName: 'Bruguiera cylindrica',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
      carbonStorage: 18,
      height: '4-7 meter',
      habitat: 'Zona Sungai & Muara',
      status: 'Stabil',
      description: 'Mangrove dengan akar lutut ramping, buah berbentuk silinder. Umum di hutan mangrove sekunder.',
      zone: 'Zona Sungai & Muara'
    },
    {
      id: 6,
      name: 'Nyirih',
      scientificName: 'Xylocarpus granatum',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
      carbonStorage: 12,
      height: '8-15 meter',
      habitat: 'Zona Belakang',
      status: 'Terancam',
      description: 'Mangrove dengan buah besar berbentuk bola. Kayunya keras dan bernilai tinggi.',
      zone: 'Zona Belakang'
    },
    {
      id: 7,
      name: 'Teruntum Merah',
      scientificName: 'Lumnitzera littorea',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
      carbonStorage: 14,
      height: '8-12 meter',
      habitat: 'Zona Belakang',
      status: 'Terancam',
      description: 'Mangrove dengan bunga merah mencolok. Cocok tumbuh di tanah berpasir dan berbatu.',
      zone: 'Zona Belakang'
    },
    {
      id: 8,
      name: 'Nipah',
      scientificName: 'Nypa fruticans',
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400',
      carbonStorage: 10,
      height: '4-7 meter',
      habitat: 'Zona Sungai & Muara',
      status: 'Perlu Perhatian',
      description: 'Palem mangrove dengan daun panjang, buah nipah digunakan untuk makanan tradisional.',
      zone: 'Zona Sungai & Muara'
    },
    {
      id: 9,
      name: 'Tengar',
      scientificName: 'Ceriops tagal',
      image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400',
      carbonStorage: 15,
      height: '5-10 meter',
      habitat: 'Zona Belakang',
      status: 'Perlu Perhatian',
      description: 'Spesies kecil dengan kulit kayu merah kecoklatan. Kulitnya digunakan untuk bahan pewarna.',
      zone: 'Zona Belakang'
    }
  ];

  const totalSpecies = speciesData.length;
  const totalCarbonStorage = speciesData.reduce((sum, species) => sum + species.carbonStorage, 0);
  const highestCarbon = Math.max(...speciesData.map(s => s.carbonStorage));
  const threatenedSpecies = speciesData.filter(s => s.status === 'Terancam').length;

  // Top 5 Carbon Storage
  const top5Species = [...speciesData]
    .sort((a, b) => b.carbonStorage - a.carbonStorage)
    .slice(0, 5);

  const maxCarbon = top5Species[0].carbonStorage;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Stabil':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Perlu Perhatian':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Terancam':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const statusCounts = {
    'Stabil': speciesData.filter(s => s.status === 'Stabil').length,
    'Perlu Perhatian': speciesData.filter(s => s.status === 'Perlu Perhatian').length,
    'Terancam': speciesData.filter(s => s.status === 'Terancam').length
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-green-800 text-white py-16 px-4 border-b border-teal-500/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl mb-6 border border-white/20">
            <Trees className="w-10 h-10 text-emerald-300" />
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Spesies Mangrove & Karbon Stok</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Jelajahi 9 spesies mangrove di kawasan Pengudang Bintan dan data penyerapan karbon untuk konservasi berkelanjutan.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Trees className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">{totalSpecies}</div>
              <div className="text-sm text-gray-600 font-medium text-center">Total Spesies</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Leaf className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{totalCarbonStorage}jt</div>
              <div className="text-sm text-gray-600 font-medium text-center">Total Cadangan Karbon (ton)</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-4xl font-bold text-teal-600 mb-2">{highestCarbon}</div>
              <div className="text-sm text-gray-600 font-medium text-center">Karbon Tertinggi (ton)</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">{threatenedSpecies}</div>
              <div className="text-sm text-gray-600 font-medium text-center">Spesies Terancam</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Top 5 & Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* Top 5 Penyerap Karbon */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-emerald-600" />
                Top 5 Penyerap Karbon
              </h3>
              <div className="space-y-4">
                {top5Species.map((species) => (
                  <div key={species.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{species.name}</span>
                      <span className="text-sm font-bold text-emerald-600">{species.carbonStorage} ton</span>
                    </div>
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${(species.carbonStorage / maxCarbon) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribusi Status Konservasi */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Distribusi Status Konservasi</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                  <span className="font-semibold text-green-700">Stabil</span>
                  <span className="text-2xl font-bold text-green-600">{statusCounts['Stabil']}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-200">
                  <span className="font-semibold text-orange-700">Perlu Perhatian</span>
                  <span className="text-2xl font-bold text-orange-600">{statusCounts['Perlu Perhatian']}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200">
                  <span className="font-semibold text-red-700">Terancam</span>
                  <span className="text-2xl font-bold text-red-600">{statusCounts['Terancam']}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start">
                  <Leaf className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800 mb-1">Rata-rata Penyerapan Karbon</p>
                    <p className="text-3xl font-bold text-blue-600">{Math.round(totalCarbonStorage / totalSpecies)} ton/tahun</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Species Cards */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {speciesData.map((species) => (
                <div
                  key={species.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={species.image}
                      alt={species.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(species.status)}`}>
                        {species.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800 mb-1">{species.name}</h4>
                        <p className="text-sm text-gray-500 italic">{species.scientificName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">{species.carbonStorage} ton</p>
                        <p className="text-xs text-gray-500">CO2/tahun</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{species.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <span className="font-semibold mr-2">Habitat:</span>
                        <span className="text-teal-600">{species.habitat}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-semibold mr-2">Tinggi:</span>
                        <span className="text-teal-600">{species.height}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-xs text-gray-500">
                          <Leaf className="w-4 h-4 mr-1 text-emerald-500" />
                          Karbon
                        </span>
                        <div className="h-2 flex-1 mx-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                            style={{ width: `${(species.carbonStorage / maxCarbon) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
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

export default SpeciesCarbonPage;