
import { DialogEmployee } from './DialogEmployee';
import { EmployeeList } from './EmployeeList';
import { getAllEmployees } from './utils';


const SideBar= async () => {
  // Datos fijos de empleados

    const {error, data, message} = await getAllEmployees()
  // Filtrar empleados basado en el término de búsqueda
  if(error || !data) {
    return (
        <div>
            {message}
        </div>
    )
  }
  return (
    <div className="bg-white h-full w-full p-5 text-gray-700 flex flex-col gap-5">
      <h2 className='text-3xl font-bold'>Trabajadores</h2>
      <DialogEmployee />
      <EmployeeList employees={data} />
    </div>
  );
};

export default SideBar;
