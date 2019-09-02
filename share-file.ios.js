"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShareFile = (function () {
    function ShareFile() {
    }
    ShareFile.getter = function (_this2, property) {
        if (typeof property === "function") {
            return property.call(_this2);
        }
        else {
            return property;
        }
    };
    ShareFile.prototype.open = function (args) {
        if (args.path) {
            try {
                var appPath = this.getCurrentAppPath();
                var path = args.path.replace("~", appPath);
                this.controller = UIDocumentInteractionController.interactionControllerWithURL(NSURL.fileURLWithPath(path));
                this.controller.delegate = new UIDocumentInteractionControllerDelegateImpl2();
                var rect = void 0;
                if (args.rect) {
                    rect = CGRectMake(args.rect.x ? args.rect.x : 0, args.rect.y ? args.rect.y : 0, args.rect.width ? args.rect.width : 0, args.rect.height ? args.rect.height : 0);
                }
                else {
                    rect = CGRectMake(0, 0, 0, 0);
                }
                if (args.options) {
                    return this.controller.presentOptionsMenuFromRectInViewAnimated(rect, this.controller.delegate.documentInteractionControllerViewForPreview(this.controller), args.animated ? true : false);
                }
                else {
                    return this.controller.presentOpenInMenuFromRectInViewAnimated(rect, this.controller.delegate.documentInteractionControllerViewForPreview(this.controller), args.animated ? true : false);
                }
            }
            catch (e) {
                console.log("ShareFile: Open file failed");
            }
        }
        else {
            console.log('ShareFile: Please add a file path');
        }
        return false;
    };
    ShareFile.prototype.getCurrentAppPath = function () {
        var currentDir = __dirname;
        var tnsModulesIndex = currentDir.indexOf("/tns_modules");
        var appPath = currentDir;
        if (tnsModulesIndex !== -1) {
            appPath = currentDir.substring(0, tnsModulesIndex);
        }
        return appPath;
    };
    return ShareFile;
}());
exports.ShareFile = ShareFile;
var UIDocumentInteractionControllerDelegateImpl2 = (function (_super) {
    __extends(UIDocumentInteractionControllerDelegateImpl2, _super);
    function UIDocumentInteractionControllerDelegateImpl2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIDocumentInteractionControllerDelegateImpl2.prototype.getViewController = function () {
        var app = ShareFile.getter(UIApplication, UIApplication.sharedApplication);
        return app.keyWindow.rootViewController;
    };
    UIDocumentInteractionControllerDelegateImpl2.prototype.documentInteractionControllerViewControllerForPreview = function (controller) {
        return this.getViewController();
    };
    UIDocumentInteractionControllerDelegateImpl2.prototype.documentInteractionControllerViewForPreview = function (controller) {
        return this.getViewController().view;
    };
    return UIDocumentInteractionControllerDelegateImpl2;
}(NSObject));
UIDocumentInteractionControllerDelegateImpl2.ObjCProtocols = [UIDocumentInteractionControllerDelegate];
//# sourceMappingURL=share-file.ios.js.map