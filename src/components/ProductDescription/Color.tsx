import React from 'react'

const Color = () => {
  return (
    <div className="mt-4">
    <label className="block mb-2 font-medium">Colors de produit</label>
    <div className="flex gap-2">
      <input placeholder="Yellow" className="flex-1 border border-gray-300 rounded p-2" />
      <input placeholder="Type color here" className="flex-1 border border-gray-300 rounded p-2" />
      <button className="bg-black text-white px-4 py-2 rounded">+</button>
    </div>
  </div>
  )
}

export default Color