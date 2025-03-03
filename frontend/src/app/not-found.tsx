import React from "react"
import Link from "next/link"


const NotFound = () => { 
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-secondary-lighter">
      <div className="-mt-16 sm:-mt-20 md:-mt-24 lg:-mt-32 xl:-mt-40">
        <div className="flex items-center justify-center">
          <div className="text-center mr-4">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-2 text-primary-darker">404</h1>
          </div>

          <div className="h-[4rem] w-[1px] bg-primary-darker mr-4"></div>
          
          <div className="flex flex-col items-start">
            <p className="text-sm mb-2 text-primary-darker">Página no encontrada</p>
            <p className="text-sm text-primary-darker">Volver a <Link href="/">El PLAC</Link></p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default NotFound