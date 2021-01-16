module.exports.sassLoader = (function () {
  const jsonImporter = require('node-sass-json-importer')();
  const fiber = require('fibers');
  const implementation = require('sass');

  return {
    loader: "sass-loader",
    options: {
      additionalData: (content, loaderContext) => {
        if (loaderContext.resourcePath.endsWith('.vue') || loaderContext.resourcePath.endsWith('.sass') ) {
          // import global variables like colors to all files
          return "@import \"~@/assets/sass/variables.sass\"\n" + content;
        } else {
          return content;
        }
      },
      implementation,
      sassOptions: (loaderContext) => {
        // make sass syntaxt default for language=sass in vue instead of scss
        const result = {fiber};
        if (/\.(vue|sass)$/.test(loaderContext.resourcePath)) {
          result.indentedSyntax = true;
          result.importer = jsonImporter;
        }
        return result;
      }
    }
  };
})();

/**
 *  Adds APP_VERSION to window object, which is a commit id or the tag
 **/
function getCvsVersion() {
  const {execSync} = require('child_process');
  let version = execSync('git rev-parse --short=10 HEAD', {encoding: 'utf8'});
  try {
    version = execSync('git describe --exact-match --tags', {encoding: 'utf8'});
  } catch (e) {
    console.error("No tags present on this commit, falling back to hash");
  }
  version = version.trim();
  return `"${version}"`;
}

module.exports.getDefinitions =(function() {
  const {DefinePlugin} = require('webpack');
  return (IS_DEBUG) => new DefinePlugin({
    CONSTS: {
      API_URL: module.exports.getConfig('API_URL', true),
      APP_VERSION: module.exports.getConfig('APP_VERSION', true) || getCvsVersion(),
      IS_DEBUG,
      ROUTER_HISTORY_MODE: module.exports.getConfig("APP_FILE_MODE") ? "'hash'" : "'history'"
    },
  });
})();

module.exports.getConfig = (function () {
  const variables = {...require(`./options.json`)};
  const keys = Object.keys(variables);
  // override only prop that exist in options.json
  for (let [key, value] of Object.entries(process.env)) {
    if (keys.indexOf(key) >= 0) {
      variables[key] = value;
    }
  }
  console.log(`Loaded config ${JSON.stringify(variables)})`)
  return function (key, encode=false) {
    if (keys.indexOf(key) <0){
      throw Error(`Environment variable '${key}' is not set`);
    }
    let value = variables[key];
    if (encode && typeof value === "string") {
      value = `"${value}"`;
    }
    return value;
  }
})();

module.exports.fileLoader = function(publicPath) {
  const path = require('path');

  return {
    test: /\.(svg|jpg|gif|png|woff2|woff|eot|ico|ttf)$/, // woff, eot, ttf- materialdesign
    loader: 'file-loader',
    options: {
      esModule: false, // vue doesn't support esmodule in things like images yet
      publicPath,
      name: f => {
        let assetsAbsolutePath = path.join(path.dirname(__dirname), 'src', 'assets');
        if (f.startsWith(assetsAbsolutePath)) {
          let dirNameInsideAssets = path.relative(assetsAbsolutePath, path.dirname(f));
          return `${dirNameInsideAssets}/[name].[ext]?[sha512:hash:base64:6]`;
        } else if (/\.(woff2|woff|eot|ttf)$/.test(f)) {
          return `fonts/node_modules/[name].[ext]?[sha512:hash:base64:6]`;
        } else {
          // throw error as we don't support images yet, what if there are 2 images with the same name
          throw Error('Unexpected image inside of node_modules')
        }
      }
    }
  }
};
