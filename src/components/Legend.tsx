import React from 'react';

const Legend: React.FC = () => {
  const legendItems = [
    { color: '#059669', label: 'Hutan Mangrove', description: 'Kawasan hutan bakau' },
    { color: '#10b981', label: 'Area Luas (> 0.0002°²)', description: 'Kawasan mangrove luas' },
    { color: '#f59e0b', label: 'Area Sedang', description: 'Kawasan mangrove sedang' },
    { color: '#ef4444', label: 'Area Kecil', description: 'Kawasan mangrove kecil' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Legenda
      </h3>
      <div className="space-y-2">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded transition-colors">
            <div
              className="w-6 h-6 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5 shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;