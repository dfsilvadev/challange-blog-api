import { v4 as uuidv4 } from 'uuid';

const mockCategory = [
  {
    id: uuidv4(),
    name: 'portuguese',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: uuidv4(),
    name: 'art',
    created_at: new Date(),
    updated_at: new Date()
  }
];

export { mockCategory };
