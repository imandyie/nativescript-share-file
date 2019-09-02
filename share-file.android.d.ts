export declare class ShareFile {
    open(args: any): void;
    fileExtension(filename: any): any;
    fileName(filename: any): any;
    _getUriForPath(path: any, fileName: any, ctx: any): android.net.Uri;
    _getUriForAbsolutePath(path: any): android.net.Uri;
    _getUriForAssetPath(path: any, fileName: any, ctx: any): android.net.Uri;
    _getUriForBase64Content(path: any, fileName: any, ctx: any): android.net.Uri;
    _writeBytesToFile(ctx: any, fileName: any, contents: any): string;
    _cleanAttachmentFolder(): void;
    toStringArray(arg: any): any;
}
