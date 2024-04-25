import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import * as Repack from '@callstack-mwg/repack';
import { deps } from './shared/dependencies.mjs';
import ExternalTemplateRemotesPlugin from 'external-remotes-plugin';
const babelLoaderConfig = {
  loader: 'babel-loader',
  options: {
    cacheCompression: false,
    cacheDirectory: true
  }
};

export default (env) => {
  const {
    mode = 'development',
    context = Repack.getDirname(import.meta.url),
    entry = './index.js',
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    reactNativePath = new URL(
      './node_modules/react-native',
      import.meta.url
    ).pathname
  } = env;
  const dirname = context;
  if (!platform) {
    throw new Error('Missing platform');
  }
  process.env.BABEL_ENV = mode;
  return {
    mode,
    cache: {
      type: 'filesystem'
    },
    devtool: false,
    context,
    entry: [
      ...Repack.getInitializationEntries(reactNativePath, {
        hmr: devServer && devServer.hmr
      }),
      entry
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
      ...Repack.getResolveOptions(platform),
      alias: {
        '@components': path.resolve(dirname, './app/components/index'),
        '@constants': path.resolve(dirname, './app/constants/index'),
        '@assets': path.resolve(dirname, './app/assets/index'),
        '@styles': path.resolve(dirname, './app/styles/index'),
        '@common': path.resolve(dirname, './app/common/index'),
        '@globalStore': path.resolve(dirname, './app/global/index')
      }
    },
    output: {
      clean: true,
      path: path.join(dirname, 'build', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      publicPath: Repack.getPublicPath({ platform, devServer })
    },
    optimization: {
      minimize,
      minimizer: [
        new TerserPlugin({
          test: /\.(js)?bundle(\?.*)?$/i,
          extractComments: false,
          terserOptions: {
            format: {
              comments: false
            }
          }
        })
      ],
      chunkIds: 'named'
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: [
            /node_modules(.*[/\\])+react/,
            /node_modules(.*[/\\])+@native-html/,
            /node_modules(.*[/\\])+@react-native/,
            /node_modules(.*[/\\])+@react-navigation/,
            /node_modules(.*[/\\])+@react-native-community/,
            /node_modules(.*[/\\])+@expo/,
            /node_modules(.*[/\\])+pretty-format/,
            /node_modules(.*[/\\])+metro/,
            /node_modules(.*[/\\])+abort-controller/,
            /node_modules(.*[/\\])+@callstack-mwg\/repack/,
            /node_modules(.*[/\\])+react-native-code-push/,
            /node_modules(.*[/\\])+code-push/,
            /node_modules(.*[/\\])+react-native-signature-canvas/,
            /node_modules(.*[/\\])+@rnmapbox\/maps/,
            /node_modules(.*[/\\])+react-freeze/,
            /node_modules(.*[/\\])+@react-native-community/,
            /node_modules(.*[/\\])+@rneui\/base/,
            /node_modules(.*[/\\])+@rneui\/themed/
          ],
          use: babelLoaderConfig
        },

        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        },
        {
          test: /\.tsx?$/,
          use: babelLoaderConfig
        },
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins:
                devServer && devServer.hmr
                  ? ['module:react-refresh/babel']
                  : undefined
            }
          }
        },
        {
          test: Repack.getAssetExtensionsRegExp(
            Repack.ASSET_EXTENSIONS.filter(
              (ext) => ext !== 'svg' && ext !== 'ico'
            )
          ),
          use: {
            loader: '@callstack-mwg/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
              scalableAssetExtensions: Repack.SCALABLE_ASSETS
            }
          }
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                native: true,
                dimensions: false
              }
            }
          ]
        },
        {
          test: /\.tsx?$/,
          use: babelLoaderConfig
        },
        {
          test: /\.js?$/,
          use: babelLoaderConfig
        },
        {
          test: /\.d.ts?$/,
          use: babelLoaderConfig
        }
      ]
    },
    plugins: [
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath
        }
      }),
      new Repack.plugins.ModuleFederationPlugin({
        name: 'host',
        shared: deps
      }),
      new Repack.plugins.ChunksToHermesBytecodePlugin({
        enabled: mode === 'production' && !devServer,
        test: /\.(js)?bundle$/,
        exclude: /index.bundle$/
      }),
      //! Dùng để clear cache remote chunk
      new ExternalTemplateRemotesPlugin()
    ]
  };
};
