import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Users')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Appointments')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Services')));
const Business = Loadable(lazy(() => import('views/utilities/Business')));
const Q_and_A = Loadable(lazy(() => import('views/utilities/Q_and_A')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'Q_and_A',
          element: <Q_and_A />
        }
      ]
    },{
      path: 'utils',
      children: [
        {
          path: 'Business',
          element: <Business />
        }
      ]
    },
    
   
  ]
};

export default MainRoutes;
