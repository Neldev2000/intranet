import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

const OrganizationChart = dynamic(() => import('@/components/OrganizationChart'), { ssr: false });

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Organigrama de la Empresa</h1>

      <OrganizationChart />
    </div>
  );
}