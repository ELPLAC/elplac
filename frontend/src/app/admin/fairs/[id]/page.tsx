// app/admin/fairs/[id]/page.tsx
import MainDashboardAdmin from "@/components/Dashboard/Admin/MainDashboardAdmin";
import ConcluirFeriaButton from "@/components/Dashboard/Admin/ConcluirFeriaButton";

interface PageProps {
  params: { id: string };
}

export default function FeriaPage({ params }: PageProps) {
  return (
    <MainDashboardAdmin>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Administrar Feria #{params.id}</h1>
        
        {/* Componente de conclusión con protección de roles */}
        <ConcluirFeriaButton fairId={params.id} />
      </div>
    </MainDashboardAdmin>
  );
}
