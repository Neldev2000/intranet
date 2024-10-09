import { obtenerPosiciones } from './utils';
import OrganizationChart from '@/components/OrganizationChart';

export default async function Home() {
  const {error, message, data} = await obtenerPosiciones()
  if(error || !data) {
    return <div>
      {message}
    </div>
  }
  return (
    <div className="  ">
      
      <OrganizationChart positions={data} />
    </div>
  );
}