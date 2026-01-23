import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Users, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  // Data untuk gallery slider
  const galleryImages = [
    {
      url: '/foto-2.JPG',
      caption: ''
    },
    {
      url: '/foto-3.jpeg',
      caption: ''
    },
    {
      url: '/foto-4.jpeg',
      caption: ''
    }
  ];

  // Auto-slide gallery
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Handler untuk navigasi ke halaman Peta
  const handleNavigateToPetaAmenitas = () => {
    navigate('/peta-amenitas');
  };

  const handleNavigateToPetaEkowisata = () => {
    navigate('/peta-ekowisata');
  };

  // // Handler untuk navigasi ke halaman Dokumen
  // const handleNavigateToDocument = () => {
  //   navigate('/dokumen');
  // };

  // Handler untuk scroll ke section tentang
  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('tentang');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/background.jpeg)',
            filter: 'brightness(0.4)'
          }}
        />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in-down tracking-tight" 
              style={{ 
                fontFamily: "'Sora', 'Outfit', sans-serif",
                textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
                letterSpacing: '-0.02em'
              }}>
            <span className="bg-gradient-to-r from-white via-teal-100 to-emerald-200 bg-clip-text text-transparent">
              SPACEMANGROVE
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 animate-fade-in-up max-w-3xl mx-auto leading-relaxed font-light"
             style={{ 
               fontFamily: "'Outfit', 'Inter', sans-serif",
               textShadow: '0 2px 8px rgba(0,0,0,0.4)',
               letterSpacing: '0.01em'
             }}>
            Platform Sistem Informasi Geografis untuk Pemetaan Mangrove Desa Srinanti
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <button 
              onClick={handleNavigateToPetaEkowisata}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/50 text-sm sm:text-base"
            >
              Peta Ekowisata Mangrove
            </button>
            <button 
              onClick={handleScrollToAbout}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-slate-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base"
            >
              Tentang Desa
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="py-12 sm:py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image */}
            <div 
              id="about-image"
              data-animate
              className={`rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 ${
                isVisible['about-image'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
              }`}
            >
              <img 
                src="/foto-1.jpeg" 
                alt="Desa Srinanti"
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
              />
            </div>
            
            {/* Content */}
            <div 
              id="about-content"
              data-animate
              className={`transition-all duration-1000 delay-300 ${
                isVisible['about-content'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
              }`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 sm:mb-6">
                Tentang Desa Srinanti
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                <p>
                  Desa Srinanti merupakan salah satu desa yang terletak di Kecamatan Sei Menggaris, Kabupaten Nunukan, Kalimantan Utara yang memiliki potensi besar dalam pengembangan kawasan ekowisata mangrove.
                </p>
                <p>
                  Melalui platform WebGIS ini, kami menyediakan akses informasi geografis yang komprehensif meliputi kawasan mangrove, penggunaan lahan, dan infrastruktur pendukung desa yang dapat dimanfaatkan untuk perencanaan dan pengambilan keputusan yang lebih baik.
                </p>
                <p>
                  WebGIS Desa Srinanti dikembangkan dengan teknologi modern untuk memudahkan masyarakat, pemerintah desa, dan stakeholder terkait dalam mengakses informasi spasial secara interaktif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { icon: MapPin, value: '1,05 km²', label: 'Luas Desa (BPS 2019)' },
              { icon: Users, value: '4.985 ha', label: 'Mangrove yang Dikelola' },
              { icon: FileText, value: '12', label: 'Rukun Tetangga' },
              { icon: Camera, value: '2.750', label: 'Jiwa (BPS 2019)' }
            ].map((stat, index) => (
              <div 
                key={index}
                id={`stat-${index}`}
                data-animate
                className={`text-center text-white transition-all duration-700 delay-${index * 100} ${
                  isVisible[`stat-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-2xl">
                    <stat.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base md:text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 mb-3 sm:mb-4">
            Galeri Desa Srinanti
          </h2>
          <p className="text-center text-slate-600 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
            Lihat dokumentasi visual dari berbagai sudut Desa Srinanti
          </p>
          
          {/* Gallery Slider */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img 
                    src={image.url} 
                    alt={image.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4 sm:p-6">
                    <p className="text-white text-base sm:text-lg md:text-xl font-semibold text-center">
                      {image.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white w-6 sm:w-8' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* View All Button */}
          {/* <div className="text-center mt-6 sm:mt-8">
            <button 
              onClick={handleNavigateToDocument}
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors text-sm sm:text-base"
            >
              Lihat Semua Dokumentasi
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Siap Menjelajahi Peta Desa Srinanti?
          </h2>
          {/* <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">
            Akses informasi geografis lengkap dan terkini dari Desa Srinanti
          </p> */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleNavigateToPetaEkowisata}
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/50"
            >
              Peta Ekowisata Mangrove
            </button>
            <button 
              onClick={handleNavigateToPetaAmenitas}
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
            >
              Peta Amenitas Wisata
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.3s both;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;