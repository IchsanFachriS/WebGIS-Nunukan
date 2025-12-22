import React from 'react';
import { MapStats } from '../types';
import InfoPanel from './InfoPanel';
import Legend from './Legend';

interface SidebarProps {
  stats: MapStats | null;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ stats, isOpen, onToggle }) => {
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-[1001] bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[999]"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-0 left-0 h-full w-80 bg-gray-50 z-[1000]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto shadow-xl lg:shadow-none
        `}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h1 className="text-2xl font-bold">WebGIS Mangrove</h1>
                <p className="text-emerald-100 text-sm">Nunukan, Kalimantan Utara</p>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <InfoPanel stats={stats} />

          {/* Legend */}
          <Legend />

          {/* Description */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tentang
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Peta ini menampilkan persebaran hutan mangrove di wilayah Nunukan, 
              Kalimantan Utara. Data mencakup informasi kondisi, luas area, dan 
              lokasi geografis dari setiap kawasan mangrove.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
            <p>© 2024 WebGIS Mangrove Nunukan</p>
            <p className="mt-1">Data dari Shapefile GeoJSON</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;