"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var application = require("tns-core-modules/application");
var fs = require("tns-core-modules/file-system");
var ShareFile = (function () {
    function ShareFile() {
    }
    ShareFile.prototype.open = function (args) {
        if (args.path) {
            try {
                var intent = new android.content.Intent();
                var map = android.webkit.MimeTypeMap.getSingleton();
                var mimeType = map.getMimeTypeFromExtension(this.fileExtension(args.path));
                intent.addFlags(android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION);
                var uris = new java.util.ArrayList();
                var uri = this._getUriForPath(args.path, '/' + this.fileName(args.path), application.android.context);
                uris.add(uri);
                var builder = new android.os.StrictMode.VmPolicy.Builder();
                android.os.StrictMode.setVmPolicy(builder.build());
                intent.setAction(android.content.Intent.ACTION_SEND_MULTIPLE);
                intent.setType("message/rfc822");
                intent.putParcelableArrayListExtra(android.content.Intent.EXTRA_STREAM, uris);
                application.android.foregroundActivity.startActivity(android.content.Intent.createChooser(intent, args.intentTitle ? args.intentTitle : 'Open file:'));
            }
            catch (e) {
                console.log('ShareFile: Android intent failed');
            }
        }
        else {
            console.log('ShareFile: Please add a file path');
        }
    };
    ShareFile.prototype.fileExtension = function (filename) {
        return filename.split('.').pop();
    };
    ShareFile.prototype.fileName = function (filename) {
        return filename.split('/').pop();
    };
    ShareFile.prototype._getUriForPath = function (path, fileName, ctx) {
        if (path.indexOf("file:///") === 0) {
            return this._getUriForAbsolutePath(path, ctx);
        }
        else if (path.indexOf("file://") === 0) {
            return this._getUriForAssetPath(path, fileName, ctx);
        }
        else if (path.indexOf("base64:") === 0) {
            return this._getUriForBase64Content(path, fileName, ctx);
        }
        else {
            if (path.indexOf(ctx.getPackageName()) > -1) {
                return this._getUriForAssetPath(path, fileName, ctx);
            }
            else {
                return this._getUriForAbsolutePath(path);
            }
        }
    };
    ShareFile.prototype._getUriForAbsolutePath = function (path, ctx) {
        var absPath = path.replace("file://", "");
        if (!file.exists()) {
            console.log("File not found: " + file.getAbsolutePath());
            return null;
        }
        else {
            return android.net.Uri.fromFile(file);
        }
    };
    ShareFile.prototype._getUriForAssetPath = function (path, fileName, ctx) {
        path = path.replace("file://", "/");
        var file = new java.io.File(path);

        return androidx.core.content.FileProvider.getUriForFile(
          application.android.foregroundActivity ||
          application.android.startActivity,
          application.android.packageName + ".fileprovider",
          file
      );
    };
    ShareFile.prototype._getUriForBase64Content = function (path, fileName, ctx) {
        var resData = path.substring(path.indexOf("://") + 3);
        var bytes;
        try {
            bytes = android.util.Base64.decode(resData, 0);
        }
        catch (ex) {
            console.log("Invalid Base64 string: " + resData);
            return android.net.Uri.EMPTY;
        }
        var cacheFileName = this._writeBytesToFile(ctx, fileName, bytes);
        return android.net.Uri.parse(cacheFileName);
    };
    ShareFile.prototype._writeBytesToFile = function (ctx, fileName, contents) {
        var dir = ctx.getExternalCacheDir();
        if (dir === null) {
            console.log("Missing external cache dir");
            return null;
        }
        var storage = dir.toString() + "/filecomposer";
        var cacheFileName = storage + "/" + fileName;
        var toFile = fs.File.fromPath(cacheFileName);
        toFile.writeSync(contents, function (e) { console.log(e); });
        if (cacheFileName.indexOf("file://") === -1) {
            cacheFileName = "file://" + cacheFileName;
        }
        return cacheFileName;
    };
    ShareFile.prototype._cleanAttachmentFolder = function () {
        if (application.android.context) {
            var dir = application.android.context.getExternalCacheDir();
            var storage = dir.toString() + "/filecomposer";
            var cacheFolder = fs.Folder.fromPath(storage);
            cacheFolder.clear();
        }
    };
    ShareFile.prototype.toStringArray = function (arg) {
        var arr = java.lang.reflect.Array.newInstance(java.lang.String.class, arg.length);
        for (var i = 0; i < arg.length; i++) {
            arr[i] = arg[i];
        }
        return arr;
    };
    return ShareFile;
}());
exports.ShareFile = ShareFile;
//# sourceMappingURL=share-file.android.js.map
