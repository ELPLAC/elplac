import MainDashboardAdmin from "@/components/Dashboard/Admin/MainDashboardAdmin";
import ConcluirFeriaButton from "@/components/Dashboard/Admin/ConcluirFeriaButton";

interface Params {
  id: string;
}

interface Props {
  params: Params;
}

export default function FeriaPage({ params }: Props) {
  return (
    <MainDashboardAdmin>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Feria #{params.id}</h1>
        <ConcluirFeriaButton fairId={params.id} />
      </div>
    </MainDashboardAdmin>
  );
}