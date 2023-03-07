import App from './app';
// import AuthRoute from '@routes/auth.route';
import AuthRoute from '@/routes/auth.route';
import PostRoute from './routes/post.route';
import SubredditRoute from './routes/subreddit.route';
import FeedRoute from './routes/feed.route';
import CommentRoute from './routes/comment.router';
// import UsersRoute from '@routes/users.route';

// validateEnv();

const app = new App([
  new AuthRoute(),
  new PostRoute(),
  new SubredditRoute(),
  new FeedRoute(),
  new CommentRoute(),
]);

app.listen();
