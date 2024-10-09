"use client"
import React, { useState, useMemo } from 'react';
import { Employee } from '../interface';



interface EmployeesByPosition {
  [position: string]: Employee[];
}

export function EmployeeList({ employees }: { employees: Employee[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const organizedEmployees = useMemo(() => {
    const organized: EmployeesByPosition = {};
    employees.forEach((employee) => {
      if (!organized[employee.position]) {
        organized[employee.position] = [];
      }
      organized[employee.position].push(employee);
    });
    return organized;
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return organizedEmployees;

    const filtered: EmployeesByPosition = {};
    Object.entries(organizedEmployees).forEach(([position, employeeList]) => {
      if (position.toLowerCase().includes(searchTerm.toLowerCase())) {
        filtered[position] = employeeList;
      }
    });
    return filtered;
  }, [organizedEmployees, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar cargo"
        value={searchTerm}
        onChange={handleSearch}
        className="bg-white border-2 border-gray-300 py-2 px-4 rounded-md text-gray-500 w-full mb-4"
      />
      {Object.entries(filteredEmployees).map(([position, employeeList]) => (
        <div key={position} className="position-group mb-4">
          <h3 className='text-2xl font-bold'>{position}</h3>
          <ul className='pl-5 flex flex-col gap-1 text-gray-500'>
            {employeeList.map((employee) => (
              <li key={employee.id}>{employee.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}