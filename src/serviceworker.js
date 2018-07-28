'use strict';

const version = 'v1.0.0';

self.addEventListener('install', event => {
  console.log('SW installed');
});

self.addEventListener('activate', event => {
  console.log('SW activated');
});