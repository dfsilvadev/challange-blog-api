import { v4 as uuidv4 } from 'uuid';

const generateRandomPosts = (count: number) => {
  const posts = [];
  for (let i = 0; i < count; i++) {
    posts.push({
      id: uuidv4(),
      title: `Título de Teste ${i + 1}`,
      content: `Conteúdo de Teste ${i + 1}`,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      user_id: uuidv4(),
      category_id: uuidv4()
    });
  }
  return posts;
};

const mockPost = {
  id: uuidv4(),
  title: 'Título de Teste',
  content: 'Conteúdo de Teste',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
  user_id: uuidv4(),
  category_id: uuidv4()
};

const mockPosts = [
  ...generateRandomPosts(3),
  {
    id: uuidv4(),
    title: 'Título de Teste 4',
    content: 'Conteúdo de Teste 4',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    user_id: '4536040b-22c5-4c38-a881-5966bf5b6cc3',
    category_id: uuidv4()
  }
];

const mockPagination = {
  total: mockPosts.length,
  totalPages: 1,
  registersPerPage: 10,
  currentPage: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  nextPage: 0,
  previousPage: 0,
  firstPage: 0,
  lastPage: 0
};

export { mockPagination, mockPost, mockPosts };
