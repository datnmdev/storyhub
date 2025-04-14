import { object, string } from 'yup';

export function generateValidateSchema() {
  return object({
    notes: string(),
  });
}
