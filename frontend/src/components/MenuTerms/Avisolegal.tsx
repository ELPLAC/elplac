"use client";

function Avisolegal() {
  return (
    <div className="flex bg-primary-lighter m-10">
      <div className="w-full p-6 mr-8">
        <div>
          <h2 className="text-lg font-bold text-primary-darker mb-8">
            Aviso Legal
          </h2>

          <p className="text-primary-dark text-justify mb-2">
            En la medida máxima permitida por la ley, excluimos todas las representaciones, garantías y condiciones relacionadas con el uso de nuestro sitio web. Esto incluye, pero no se limita a, cualquier garantía implícita relacionada con la calidad, idoneidad para un propósito específico y el uso adecuado de cuidados razonables y habilidades.
          </p>

          <p className="text-primary-dark text-justify mb-2">
            En ningún caso, este aviso legal:
          </p>

          <ul className="text-primary-dark list-disc pl-5 mb-2">
            <li>No limita ni excluye nuestra responsabilidad o la tuya por fraude o tergiversación fraudulenta.</li>
            <li>No limita ninguna responsabilidad que no pueda ser limitada según la ley aplicable.</li>
            <li>No excluye responsabilidades que no puedan ser excluidas bajo la ley aplicable.</li>
          </ul>

          <p className="text-primary-dark text-justify mb-2">
            Las limitaciones y exclusiones de responsabilidad establecidas en este aviso legal son las siguientes:
          </p>

          <ol className="text-primary-dark list-decimal pl-5 mb-2">
            <li>Están sujetas a la sección anterior.</li>
            <li>Se aplican a todas las responsabilidades derivadas de esta exención, ya sea por contrato, agravio (incluida la negligencia) o incumplimiento de un deber legal.</li>
          </ol>

          <p className="text-primary-dark text-justify mb-2">
            En caso de que el sitio web y los servicios e información que proporcionamos sean de acceso gratuito, no nos hacemos responsables de ninguna pérdida o daño de ningún tipo.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Avisolegal;
