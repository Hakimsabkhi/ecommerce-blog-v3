import Image from 'next/image'
import React from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { IoCheckboxOutline } from 'react-icons/io5'
import { RxCross1 } from 'react-icons/rx'

interface RecapProductProps {
items:CartItem[],
incrementHandler(item: CartItem) : void,
decrementHandler(item: CartItem) : void,
 removeCartHandler(_id: string): void
}
interface CartItem {
    _id: string;
    name: string;
    description: string;
    ref: string;
    price: number;
    imageUrl?: string;
    stock: number;
    discount?: number;
    color?: string;
    material?: string;
    status?: string;
    quantity: number;
  }
const RecapProduct: React.FC<RecapProductProps> = ({ items ,incrementHandler ,decrementHandler,removeCartHandler }) => {


  return (
    <div>          {items.length > 0 ? (   <div className="flex flex-col divide-y-2">
        {items.map((item) => (
          <div key={item._id} className="py-4 flex justify-between ">
            <div className="flex gap-4 w-full ">
              <div>
                <Image
                  className="rounded-lg"
                  src={item.imageUrl || "/path/to/default-image.jpg"}
                  alt={item.name}
                  width={150} // Add width
                  height={150} // Add height
                />
              </div>
              <div className="flex flex-col justify-between w-2/5">
                <div className="flex flex-col gap-2 ">
                  <p className="text-xl">{item.name}</p>
                  <div className=" text-gray-400">
                    <p>{item.color}</p>
                    <p>{item.ref}</p>
                  </div>
                  {item.discount != null && item.discount > 0 ? (
                    <p>
                      {" "}
                      {(
                        item.price -
                        (item.price * (item.discount ?? 0)) / 100
                      ).toFixed(2)}
                      TND
                    </p>
                  ) : (
                    <p>{item.price.toFixed(2)} TND</p>
                  )}
                </div>
                <p className="text-gray-400 font-bold flex items-center gap-2">
                  <IoCheckboxOutline size={25} />
                  <p className="uppercase">{item.status}</p>
                </p>
              </div>
              <div className={`flex items-center w-[2/5]  `}>
                <p className={"py-2 px-8 border-2 rounded-l-lg w-20"}>
                  {item.quantity}
                </p>

                <div className="border-t-2 border-r-2 border-b-2 py-1 px-2 rounded-r-lg ">
                  <IoIosArrowUp
                    className="cursor-pointer"
                    onClick={() => incrementHandler(item)}
                  />
                  <IoIosArrowDown
                    className="cursor-pointer"
                    onClick={() => decrementHandler(item)}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center w-[17%]">
              {item.discount != null && item.discount > 0 ? (
                <p>
                  {" "}
                  {(item.price -
                    (item.price * (item.discount ?? 0)) / 100) *
                    item.quantity}{" "}
                  TND
                </p>
              ) : (
                <p>{item.price * item.quantity} TND</p>
              )}
            </div>
            <div>
              <RxCross1
                className="cursor-pointer"
                onClick={() => removeCartHandler(item._id)}
                size={35}
              />
            </div>
          </div>
        ))}
      </div>) : (
<div className="flex flex-col divide-y-2 items-center "><Image alt="empty" src="https://res.cloudinary.com/dx499gc6x/image/upload/f_webp/v1726584013/empty_cart.45e2dadaaca71284eb3a_heojvk.webp
" width={500} height={500}/>
<span className="text-gray-600">Empty</span></div>
)}</div>
  )
}

export default RecapProduct