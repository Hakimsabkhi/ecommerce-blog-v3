import React from 'react'

const Dimension = () => {
  return (
    <div className="mt-4 border border-gray-300 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-3">Dimention :</h2>
          <div className="flex gap-2 mb-3">
            <span className="px-3 py-1 bg-gray-800 text-white rounded text-lg font-bold">H</span>
            <span className="px-3 py-1 bg-gray-800 text-white rounded text-lg font-bold">L</span>
            <span className="px-3 py-1 bg-gray-800 text-white rounded text-lg font-bold">E</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input placeholder="Hauteur" className="border border-gray-300 rounded p-2" />
            <input placeholder="Largeur" className="border border-gray-300 rounded p-2" />
            <input placeholder="Épaisseur" className="border border-gray-300 rounded p-2" />
          </div>
        </div>
  )
}

export default Dimension