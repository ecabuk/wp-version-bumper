const minimist = require('minimist')
    , semver = require('semver')
    , log = require('fancy-log')
    , fs = require('fs')
;

/**
 * @param {function} cb
 * @param {[{
 *    file: String,
 *    search:RegExp,
 *    replace:String
 *  }]} files
 * @param {RegExp} initFileRegex
 */
module.exports = (cb, files, initFileRegex = /^\s*Version: (?<version>(?<major>\d).(?<minor>\d).(?<patch>.*))$/m) => {
    const mainFile = files[0];
    const mainFileContent = fs.readFileSync(mainFile.file).toString();

    const {
        version: old_version,
        major: old_major,
        minor: old_minor,
        patch: old_patch
    } = initFileRegex
        .exec(mainFileContent)
        .groups;

    if (!semver.valid(old_version)) {
        log('Current version is not valid.');
        return cb();
    }

    log(`Current Version: ${old_version}`);

    const args = process.argv.slice(3);
    if (args.length === 0)
        return cb(); // Only display

    let argv = minimist(args);
    const val = {
        major: old_major,
        minor: old_minor,
        patch: old_patch,
        version: old_version
    };

    ['major', 'minor', 'patch'].forEach(k => {
        if (argv[k] === true) {
            val.version = semver.inc(val.version, k);
            val[k] = semver[k](val.version);
        } else if (k in argv) {
            val[k] = argv[k];
            val.version = [val.major, val.minor, val.patch].join('.')
        }
    });

    // Pre release
    if ('prerelease' in argv) {
        val.version = semver.inc(val.version, 'prerelease', argv.prerelease);
    }

    log(`New Version: ${val.version}`);

    files.forEach(({file, search, replace}) =>
        fs.writeFileSync(file, fs.readFileSync(file).toString()
            .replace(search, replace.replace('#NEW_VERSION#', val.version))));

    cb();
};