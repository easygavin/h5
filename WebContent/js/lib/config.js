seajs.config({
  base: './js',
  plugins: ['shim'],
  alias: {
    'class': 'lib/class',
    'zepto': 'lib/zepto',
    'underscore': 'lib/underscore',
    'fastclick': 'lib/fastclick',
    'config': 'tools/config',
    'events': 'tools/events',
    'util': 'tools/util',
    'page': 'tools/page',
    'md5': 'tools/md5',
    'path': 'tools/path'
  },
  map: [
    [/^(.*\.(?:css|js|tpl))(.*)$/i, '$1?v=1.0.30']
  ],
  preload: [
    'lib/seajs-text'
  ]
});