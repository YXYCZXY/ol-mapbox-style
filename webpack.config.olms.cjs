const {join} = require('path');
const path = require('path');

const externals = {
  'ol/style/Style.js': 'ol.style.Style',
  'ol/style/Circle.js': 'ol.style.Circle',
  'ol/style/Icon.js': 'ol.style.Icon',
  'ol/style/Stroke.js': 'ol.style.Stroke',
  'ol/style/Fill.js': 'ol.style.Fill',
  'ol/style/Text.js': 'ol.style.Text',
  'ol/obj.js': 'ol.obj',
  'ol/proj.js': 'ol.proj',
  'ol/render/Feature.js': 'ol.render.Feature',
  'ol/tilegrid.js': 'ol.tilegrid',
  'ol/tilegrid/TileGrid.js': 'ol.tilegrid.TileGrid',
  'ol/format/GeoJSON.js': 'ol.format.GeoJSON',
  'ol/format/MVT.js': 'ol.format.MVT',
  'ol/Map.js': 'ol.Map',
  'ol/View.js': 'ol.View',
  'ol/Observable.js': 'ol.Observable',
  'ol/layer/Tile.js': 'ol.layer.Tile',
  'ol/layer/Vector.js': 'ol.layer.Vector',
  'ol/layer/VectorTile.js': 'ol.layer.VectorTile',
  'ol/source/TileJSON.js': 'ol.source.TileJSON',
  'ol/source/Vector.js': 'ol.source.Vector',
  'ol/source/VectorTile.js': 'ol.source.VectorTile',
};

function createExternals() {
  const createdExternals = {};
  for (const key in externals) {
    createdExternals[key] = {
      root: externals[key].split('.'),
      commonjs: key,
      commonjs2: key,
      amd: key,
      module: key,
    };
  }
  return createdExternals;
}

/**
 * @param {'js' | 'es.js'} type Type.
 * @return {Object} Webpack config.
 */
const createConfig = (type) => ({
  entry: './src/olms.js',
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['remove-flow-types-loader'],
        include: join(
          __dirname,
          'node_modules',
          '@mapbox',
          'mapbox-gl-style-spec'
        ),
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        include: join(
          __dirname,
          'node_modules',
          '@mapbox',
          'mapbox-gl-style-spec',
          'reference'
        ),
        use: ['json-strip-loader?keys[]=doc,keys[]=example'],
      },
      {
        test: /\.js$/,
        include: [__dirname],
        use: {
          loader: 'buble-loader',
          options: {
            transforms: {dangerousForOf: true},
          },
        },
      },
    ],
  },
  output: {
    path: path.resolve('./dist'), // Path of output file
    filename: `olms.${type}`,
    library: {
      name: type === 'js' ? 'olms' : undefined,
      type: type === 'js' ? 'umd' : 'module',
    },
  },
  resolve: {
    fallback: {
      'assert': path.join(__dirname, 'node_modules', 'nanoassert'),
    },
  },
  externals: createExternals(),
});

module.exports = [
  createConfig('js'),
  Object.assign(createConfig('es.js'), {
    experiments: {outputModule: true},
    optimization: {minimize: false},
  }),
];
