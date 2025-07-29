import { v4 as uuidv4 } from 'uuid';

const mockPost = {
  id: uuidv4(),
  title: 'Teste de titulo',
  content: 'testanto texto',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
  user_id: uuidv4(),
  category_id: uuidv4()
};

export { mockPost };
