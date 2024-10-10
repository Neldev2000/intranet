export type ActionData = {
    label: string;
    description: string;
    responsibilities: { descripcion: string }[];
    qualifications: { descripcion: string }[];
    reports_to: string;
    files:File[];
};