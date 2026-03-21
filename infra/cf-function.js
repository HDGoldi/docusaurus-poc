// CloudFront Function: SPA routing for Docusaurus
// Runtime: cloudfront-js-2.0
// Attached as viewer-request to both prod and preview distributions
//
// Handles Docusaurus default trailing-slash behavior (trailingSlash: undefined)
// which generates /page/index.html structure. This function rewrites URIs so
// CloudFront can serve the correct S3 object.
async function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // URI ends with slash: append index.html
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    // URI has no file extension: append /index.html
    else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }

    return request;
}
