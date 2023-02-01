import App from './app';
// import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
// import UsersRoute from '@routes/users.route';

// validateEnv();

const app = new App([new IndexRoute()]);

app.listen();
