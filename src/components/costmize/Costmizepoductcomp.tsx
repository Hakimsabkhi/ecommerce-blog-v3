import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CostmizepoductcompParam {
  name: string;
  handleSubmit: (e: React.FormEvent) => void;
  handleUpdate: (e: React.FormEvent) => void;
  handleImageChange:(e: React.ChangeEvent<HTMLInputElement>, fieldName: string)=>void;
  formdata: {
    wbtitle: string;
    wbsubtitle: string;
    wbbanner: string;
    pctitle: string;
    pcsubtitle: string;
    pcbanner: string;
    cptitle: string;
    cpsubtitle: string;
    cpbanner: string;
  };
  imagePreview: {
    pcbannerPreview: string | null;
    wbbannerPreview: string | null;
    cpbannerPreview: string | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  url: string;
  id: string;
}

export const Costmizepoductcomp: React.FC<CostmizepoductcompParam> = ({
  name,
  handleSubmit,
  handleUpdate,
  formdata,
  handleChange,
  error,
  url,
  id,
  handleImageChange,
  imagePreview,
}) => {


  return (
    <div>
      <div className="flex flex-col gap-8 mx-auto w-[90%] py-8">
        <p className="text-3xl font-bold">{id ? 'Update' : 'Create'} Customize {name} Title</p>

        <form onSubmit={id ? handleUpdate : handleSubmit} className="flex flex-col items-center mx-auto gap-4 w-2/3 max-lg:w-full">
          {/* Product Collection Title */}
          <div className="flex items-center gap-6 w-full justify-between">
            <p className="text-xl max-lg:text-base font-bold">Product Collection Title*</p>
            <input
              name="pctitle"
              type="text"
              value={formdata.pctitle}
              onChange={handleChange}
              className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
              required
            />
          </div>

          {/* Product Collection Subtitle */}
          <div className="flex items-center gap-6 w-full justify-between">
            <p className="text-xl max-lg:text-base font-bold">Product Collection SubTitle*</p>
            <input
              name="pcsubtitle"
              type="text"
              value={formdata.pcsubtitle}
              onChange={handleChange}
              className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
              required
            />
          </div>

          {/* Product Collection Banner */}
          <div className="flex items-center gap-6 w-full justify-between">
            <p className="text-xl max-lg:text-base font-bold">Product Collection Upload Banner*</p>
            <input
              name="pcbanner"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'pcbanner')}
              className="hidden"
              id="upload-pcbanner"
            />
            <label htmlFor="upload-pcbanner" className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5">
              Select a Banner
            </label>
            {imagePreview.pcbannerPreview && (
              <div className="w-[50%] max-lg:w-full">
                <Image
                  src={imagePreview.pcbannerPreview}
                  alt="Banner preview"
                  className="w-full h-auto mt-4"
                  width={1000}
                  height={1000}
                />
              </div>
            )}
          </div>

          {/* Best Product Title */}
          <div className="flex items-center gap-6 w-full justify-between">
            <p className="text-xl max-lg:text-base font-bold">Best Product Title*</p>
            <input
              name="wbtitle"
              type="text"
              value={formdata.wbtitle}
              onChange={handleChange}
              className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
              required
            />
          </div>

          {/* Best Product Subtitle */}
          <div className="flex items-center gap-6 w-full justify-between">
            <p className="text-xl max-lg:text-base font-bold">Best Product SubTitle*</p>
            <input
              name="wbsubtitle"
              type="text"
              value={formdata.wbsubtitle}
              onChange={handleChange}
              className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
              required
            />
          </div>

          {/* Best Product Banner */}
          <div className="flex items-center gap-6 w-full justify-between">
            <p className="text-xl max-lg:text-base font-bold">Best Product Upload Banner*</p>
            <input
              name="wbbanner"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'wbbanner')}
              className="hidden"
              id="upload-wbbanner"
            />
            <label htmlFor="upload-wbbanner" className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5">
              Select a Banner
            </label>
            {imagePreview.wbbannerPreview && (
              <div className="w-[50%] max-lg:w-full">
                <Image
                  src={imagePreview.wbbannerPreview}
                  alt="Banner preview"
                  className="w-full h-auto mt-4"
                  width={1000}
                  height={1000}
                />
              </div>
            )}
          </div>

          {/* Product Promotion Title */}
          <div className="flex items-center gap-6 w-full justify-between">
            <p className="text-xl max-lg:text-base font-bold">Product Promotion Title*</p>
            <input
              name="cptitle"
              type="text"
              value={formdata.cptitle}
              onChange={handleChange}
              className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
              required
            />
          </div>

          {/* Product Promotion Subtitle */}
          <div className="flex items-center gap-6 w-full justify-between">
            <p className="text-xl max-lg:text-base font-bold">Product Promotion SubTitle*</p>
            <input
              name="cpsubtitle"
              type="text"
              value={formdata.cpsubtitle}
              onChange={handleChange}
              className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
              required
            />
          </div>

          {/* Product Promotion Banner */}
          <div className="flex items-center gap-6 w-full justify-between">
            <p className="text-xl max-lg:text-base font-bold">Product Promotion Upload Banner*</p>
            <input
              name="cpbanner"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'cpbanner')}
              className="hidden"
              id="upload-cpbanner"
            />
            <label htmlFor="upload-cpbanner" className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5">
              Select a Banner
            </label>
            {imagePreview.cpbannerPreview && (
              <div className="w-[50%] max-lg:w-full">
                <Image
                  src={imagePreview.cpbannerPreview}
                  alt="Banner preview"
                  className="w-full h-auto mt-4"
                  width={1000}
                  height={1000}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex w-full justify-center gap-4 px-20">
            <Link className="w-1/2" href={`${url}`}>
              <button className="w-full rounded-md border-2 font-light h-10">
                <p className="font-bold">Cancel</p>
              </button>
            </Link>
            <button type="submit" className="w-1/2 bg-gray-800 text-white rounded-md hover:bg-gray-600 h-10">
              <p className="text-white">{id ? 'Update' : 'Create'} Title</p>
            </button>
          </div>
        </form>

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};
