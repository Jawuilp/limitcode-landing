/**
 * Cloudflare Pages middleware.
 *
 * Consolidates the duplicate host: any request served from the default
 * Cloudflare Pages URL (`*.pages.dev`, including branch/preview deployments)
 * is permanently redirected (301) to the canonical custom domain.
 *
 * Why: the site is served identically on both `limitcode-pro.pages.dev` and
 * `limitcode.jawuil.dev`, which is duplicate content across two hosts and can
 * keep Google from crawling/indexing the canonical host ("Discovered - currently
 * not indexed"). This makes the custom domain the only reachable home.
 *
 * Requests to the custom domain pass through untouched.
 */
export const onRequest = async (context) => {
  const url = new URL(context.request.url);

  if (url.hostname.endsWith(".pages.dev")) {
    url.hostname = "limitcode.jawuil.dev";
    url.protocol = "https:";
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
};
