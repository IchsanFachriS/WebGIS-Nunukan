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
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
      caption: 'Pemandangan Desa Srinanti'
    },
    {
      url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200',
      caption: 'Aktivitas Pertanian Masyarakat'
    },
    {
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200',
      caption: 'Infrastruktur Desa'
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

  // Handler untuk navigasi ke halaman WebGIS
  const handleNavigateToWebGIS = () => {
    navigate('/webgis');
  };

  // Handler untuk navigasi ke halaman Dokumen
  const handleNavigateToDocument = () => {
    navigate('/dokumen');
  };

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
            backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600)',
            filter: 'brightness(0.4)'
          }}
        />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in-down tracking-tight" 
              style={{ 
                fontFamily: "'Sora', 'Outfit', sans-serif",
                textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
                letterSpacing: '-0.02em'
              }}>
            <span className="bg-gradient-to-r from-white via-teal-100 to-emerald-200 bg-clip-text text-transparent">
              WebGIS Desa Srinanti
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up max-w-3xl mx-auto leading-relaxed font-light"
             style={{ 
               fontFamily: "'Outfit', 'Inter', sans-serif",
               textShadow: '0 2px 8px rgba(0,0,0,0.4)',
               letterSpacing: '0.01em'
             }}>
            Platform Sistem Informasi Geografis untuk Pemetaan dan Pengelolaan Data Spasial Desa Srinanti
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <button 
              onClick={handleNavigateToWebGIS}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/50"
            >
              Lihat Peta WebGIS
            </button>
            <button 
              onClick={handleScrollToAbout}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-slate-900 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
            >
              Tentang Desa
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div 
              id="about-image"
              data-animate
              className={`rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 ${
                isVisible['about-image'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
              }`}
            >
              <img 
                src="https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800" 
                alt="Desa Srinanti"
                className="w-full h-96 object-cover"
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
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                Tentang Desa Srinanti
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Desa Srinanti merupakan salah satu desa yang terletak di wilayah Kabupaten yang memiliki potensi besar dalam pengembangan wilayah berbasis data spasial.
                </p>
                <p>
                  Melalui platform WebGIS ini, kami menyediakan akses informasi geografis yang komprehensif meliputi data administrasi, penggunaan lahan, infrastruktur, dan potensi desa yang dapat dimanfaatkan untuk perencanaan dan pengambilan keputusan yang lebih baik.
                </p>
                <p>
                  WebGIS Desa Srinanti dikembangkan dengan teknologi modern untuk memudahkan masyarakat, pemerintah desa, dan stakeholder terkait dalam mengakses informasi spasial secara real-time dan interaktif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: MapPin, value: '1,05', label: 'km²' },
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
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <stat.icon className="w-10 h-10" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
            Galeri Desa Srinanti
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Lihat dokumentasi visual dari berbagai sudut Desa Srinanti
          </p>
          
          {/* Gallery Slider */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative h-96 md:h-[500px]">
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
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-6">
                    <p className="text-white text-xl font-semibold text-center">
                      {image.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6 text-slate-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6 text-slate-800" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center mt-8">
            <button 
              onClick={handleNavigateToDocument}
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
            >
              Lihat Semua Dokumentasi
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
            Fitur WebGIS
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Platform yang dilengkapi dengan berbagai fitur untuk memudahkan akses informasi spasial
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Peta Interaktif',
                description: 'Jelajahi peta desa secara interaktif dengan berbagai layer informasi yang dapat diaktifkan/nonaktifkan sesuai kebutuhan',
                icon: '🗺️'
              },
              {
                title: 'Data Spasial',
                description: 'Akses data spasial lengkap meliputi batas administrasi, penggunaan lahan, dan infrastruktur desa',
                icon: '📊'
              },
              {
                title: 'Analisis Wilayah',
                description: 'Lakukan analisis spasial sederhana untuk mendukung perencanaan dan pengambilan keputusan',
                icon: '🔍'
              }
            ].map((feature, index) => (
              <div
                key={index}
                id={`feature-${index}`}
                data-animate
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${
                  isVisible[`feature-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Siap Menjelajahi Peta Desa Srinanti?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Akses informasi geografis lengkap dan terkini dari Desa Srinanti
          </p>
          <button 
            onClick={handleNavigateToWebGIS}
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/50"
          >
            Mulai Eksplorasi WebGIS
          </button>
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