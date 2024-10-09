import { getPositions } from './utils';
import OrganizationChart from '@/components/OrganizationChart';

export default async function Home() {
  const {error, message, data} = await getPositions()
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