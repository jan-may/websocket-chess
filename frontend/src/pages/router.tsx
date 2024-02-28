import { createBrowserRouter } from 'react-router-dom';
import { Root } from './Root';
import { ErrorPage } from './Error-page';
import { Lobby } from './Lobby';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: '/lobby',
    element: <Lobby />
  }
]);
