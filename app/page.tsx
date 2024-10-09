import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

const OrganizationChart = dynamic(() => import('@/components/OrganizationChart'), { ssr: false });

export default function Home() {
  return (
    <div className="  ">
  
      <OrganizationChart />
    </div>
  );
}