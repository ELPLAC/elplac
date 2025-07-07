import MainDashboardAdmin from "@/components/Dashboard/Admin/MainDashboardAdmin";
import ConcluirFeriaButton from "@/components/Dashboard/Admin/ConcluirFeriaButton";

interface FairPageProps {
  params: { id: string };
}

const FeriaPage = ({ params }: FairPageProps) => {
  const { id } = params;

  return (
    <MainDashboardAdmin>
      <h1 className="text-xl font-bold mb-4">Feria #{id}</h1>

      {/* Acá podrías mostrar info de la feria si tenés SWR o fetch */}

      <ConcluirFeriaButton fairId={id} />
    </MainDashboardAdmin>
  );
};

export default FeriaPage;
