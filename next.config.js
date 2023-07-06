// const calendarTranspile = require('next-transpile-modules')([
//   '@fullcalendar/common',
//   '@fullcalendar/react',
//   '@fullcalendar/daygrid',
//   '@fullcalendar/list',
//   '@fullcalendar/timegrid'
// ]);

// const withImages = require('next-images');

// const redirects = {
//   async redirects() {
//     return [
//       {
//         source: '/dashboards/healthcare',
//         destination: '/dashboards/healthcare/doctor'
//       },
//       {
//         source: '/dashboards',
//         destination: '/dashboards/reports'
//       },
//       {
//         source: '/applications',
//         destination: '/applications/file-manager'
//       },
//       {
//         source: '/blocks',
//         destination: '/blocks/charts-large'
//       },
//       {
//         source: '/management',
//         destination: '/management/users'
//       }
//     ];
//   }
// };
export const experimental = {
  appDir: true
}
export const eslint = {
  // Warning: This allows production builds to successfully complete even if
  // project has ESLint errors.
  ignoreDuringBuilds: true,
};

export const images = {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '3000',
      // pathname: '/account123/**',
    },
  ],
} 