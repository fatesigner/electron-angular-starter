/**
 * Custom angular webpack configuration
 */

module.exports = (config, options) => {
  config.target = 'electron-renderer';

  if (options.fileReplacements) {
    for (const fileReplacement of options.fileReplacements) {
      if (fileReplacement.replace !== 'src/environments/environment.ts') {
        continue;
      }

      const fileReplacementParts = fileReplacement.with.split('.');
      if (fileReplacementParts.length > 1 && ['web'].indexOf(fileReplacementParts[1]) >= 0) {
        // config.target = 'web';
      }
      break;
    }
  }

  return config;
};
