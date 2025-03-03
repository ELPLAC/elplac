"use client";

function Cookies() {
  return (
    <div className="flex bg-primary-lighter m-10">
      <div className="w-full p-6 mr-8">
        <div>
          <h2 className="text-lg font-bold text-primary-darker mb-8">
            Uso de Almacenamiento en el Navegador
          </h2>

          <p className="text-primary-dark text-justify mb-2">
            Al utilizar nuestro sitio web, almacenamos de manera temporal en tu navegador algunos datos necesarios para asegurar el funcionamiento adecuado de nuestra aplicación. Estos datos no se consideran cookies tradicionales, pero cumplen una función similar al guardar información importante como tu estado de inicio de sesión y preferencias durante tu navegación.
          </p>
          
          <p className="text-primary-dark text-justify mb-2">
            Los datos que se almacenan son esenciales para:
          </p>
          
          <ul className="text-primary-dark list-disc pl-5 mb-2">
            <li>Mantenerte autenticado durante tu sesión.</li>
            <li>Recordar tus preferencias o configuraciones mientras navegas por el sitio.</li>
          </ul>

          <p className="text-primary-dark text-justify mb-2">
            Esta información no recopila datos personales identificables ni se utiliza con fines de marketing o análisis. Solo se almacenan los datos necesarios para que puedas disfrutar de una experiencia fluida en nuestro sitio.
          </p>

          <p className="text-primary-dark text-justify mb-2">
            <strong>Consentimiento:</strong> Al utilizar nuestro sitio web, aceptas que almacenemos esta información en tu navegador para el correcto funcionamiento de la plataforma. Si prefieres no permitir que se almacenen estos datos, puedes ajustar la configuración de tu navegador para bloquear este almacenamiento. Ten en cuenta que, si desactivas esta función, algunas funcionalidades del sitio podrían no estar disponibles.
          </p>

          <p className="text-primary-dark text-justify mb-2">
            Aclaramos que no utilizamos cookies tradicionales, sino que solo almacenamos información relevante en el navegador, lo que es prácticamente lo mismo en cuanto a funcionalidad.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cookies;
