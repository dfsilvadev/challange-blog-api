import app from './main';
import config from './utils/config/config';

const PORT = config.port || 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🔥 Servidor iniciado em http://localhost:${PORT}`);
});
