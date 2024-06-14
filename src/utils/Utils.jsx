import { format } from 'date-fns';

//Format datetime for modified
export const formatDateTime = (date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm:ss');
};