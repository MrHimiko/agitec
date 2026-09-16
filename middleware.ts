import { next } from '@vercel/functions';

// Preview password gate for the whole site (Vercel Routing Middleware).
// Only the SHA-256 hash of the password lives in the repo.
const PASSWORD_HASH = '3aa2ac2b0b8d210ffce3a0c12a946749162fe6ce0838d5e081ea31647fcc4ec2';
const COOKIE_NAME = 'agitec_preview';
const LOGIN_PATH = '/__preview-login';
const MAX_AGE = 60 * 60 * 24 * 30;

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!favicon\\.svg).*)'],
};

async function sha256(value: string) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, '0')).join('');
}

function safeTarget(value: unknown) {
  const target = typeof value === 'string' ? value : '/';
  return target.startsWith('/') && !target.startsWith('//') && !target.startsWith(LOGIN_PATH) ? target : '/';
}

function readCookie(request: Request, name: string) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return null;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

function loginPage(target: string, failed: boolean) {
  const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Vorschau – AGITEC</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{min-height:100vh;display:grid;place-items:center;padding:24px;font-family:"Archivo",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;color:#0e2230;background:#f7f7f7}
.card{width:100%;max-width:420px;padding:48px 40px 40px;background:#fff;box-shadow:0 24px 48px -24px rgba(14,34,48,.18)}
.logo{display:block;margin-bottom:40px}
.eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:16px;font-size:13px;font-weight:500;letter-spacing:.06em;text-transform:uppercase}
.eyebrow::before{content:"";width:4px;height:4px;background:#0069b3}
.eyebrow span{opacity:.5}
h1{font-size:30px;line-height:36px;font-weight:500;letter-spacing:-.02em}
p{margin-top:12px;font-size:16px;line-height:24px;opacity:.7}
form{margin-top:32px;display:grid;gap:12px}
label{font-size:13px;color:#5d646a}
input{width:100%;height:52px;padding:0 16px;font:inherit;font-size:16px;color:#0e2230;background:#fff;border:1px solid #dedede;outline:0;transition:border-color .2s,box-shadow .2s}
input:focus{border-color:#0069b3;box-shadow:0 0 0 3px rgba(0,105,179,.12)}
.error input{border-color:#c62828}
.msg{font-size:13px;color:#c62828}
button{position:relative;overflow:hidden;isolation:isolate;height:52px;margin-top:8px;font:inherit;font-size:15px;font-weight:500;color:#fff;background:#0069b3;border:0;cursor:pointer}
button::before{content:"";position:absolute;inset:0;z-index:-1;background:#0e2230;transform:scaleX(0);transform-origin:right;transition:transform .5s cubic-bezier(.22,1,.36,1)}
button:hover::before{transform:scaleX(1);transform-origin:left}
</style>
</head>
<body>
<main class="card">
<span class="logo"><svg xmlns="http://www.w3.org/2000/svg" width="160" height="46" aria-label="AGITEC" viewBox="0 0 186 53" fill="none"><path d="M79.1238 13.25H97.6057L96.3657 21.0233L91.5238 20.7878L88.9257 37.1H80.1276L82.7257 20.7878L77.8838 21.0233L79.1238 13.25Z" fill="#9C9B9B"/><path d="M81.0136 36.2725H88.4536L90.9927 20.3136L95.6574 20.5492L96.7203 14.0714H79.8917L78.8879 20.5492L83.6117 20.3136L81.0136 36.2725ZM89.3393 37.3325H79.7736L82.3127 21.4325L77.5889 21.6681L78.947 13.0703H97.8422L96.4841 21.6681L91.8193 21.4325L89.3393 37.3325Z" fill="#9C9B9B"/><path d="M99.7902 13.25H116.028L114.965 19.7867H107.585L107.23 22.0833H113.962L112.958 28.2667H106.226L105.813 30.6222H113.489L112.485 37.1H95.9521L99.7902 13.25Z" fill="#9C9B9B"/><path d="M134.983 22.9648C133.802 21.6693 132.208 20.5504 130.2 20.5504C127.543 20.5504 125.122 22.6115 124.65 25.2026C124.237 27.8526 126.185 29.8548 128.783 29.8548C130.791 29.8548 132.562 29.0304 134.157 27.6171L132.444 36.5093C130.909 37.157 127.602 37.4515 126.008 37.4515C119.1 37.4515 114.553 32.1515 115.675 25.3793C116.797 18.4304 123.233 12.8359 130.319 12.8359C132.326 12.8359 134.275 13.1893 136.046 13.837L134.983 22.9648Z" fill="#9C9B9B"/><path d="M24.859 0H44.5219L19.6038 50.35H0L24.859 0Z" fill="#0069B3"/><path d="M47.1198 0H66.7826L41.8646 50.35H22.2607L47.1198 0Z" fill="#6F9DD3"/><path d="M69.3805 0H89.0434L64.1253 50.35H44.5215L69.3805 0Z" fill="#A3BCE3"/><path d="M16.6517 37.1553H7.2041L19.0727 13.1875H28.9336L34.366 37.1553H24.9184L24.5051 34.1519H17.7736L16.6517 37.1553ZM23.7374 28.4986L23.2651 24.2586C23.147 23.2575 23.147 22.1975 23.0879 21.1964H22.7336L20.0765 28.4986H23.7374Z" fill="white"/><path d="M61.469 23.0279C60.8194 26.9146 60.3471 30.2124 57.0404 33.2746C54.029 36.0424 49.7775 37.5146 45.9985 37.5146C38.4994 37.5146 33.0671 32.9801 34.189 25.3246C35.2518 17.4924 41.8652 12.7812 49.6004 12.7812C53.8518 12.7812 59.4613 14.8424 60.7604 18.9646L51.9623 21.9679C51.4309 20.7312 50.2499 20.1424 48.8328 20.1424C45.6442 20.1424 43.5185 22.7924 43.0461 25.7368C42.6328 28.3868 43.9909 30.8601 46.8842 30.8601C48.3013 30.8601 50.1909 30.2124 50.7813 28.7401H46.7661L47.5928 23.0868H61.469V23.0279Z" fill="white"/><path d="M65.1889 13.1875H74.1051L70.6213 37.1553H61.7051L65.1889 13.1875Z" fill="white"/><path d="M79.7733 50.1113C79.7733 51.9368 78.7695 52.9968 76.4666 52.9968C75.7581 52.9968 75.1676 52.9379 74.1638 52.5846L74.2819 51.5835C75.1676 51.9957 75.7581 52.1135 76.6438 52.1135C77.8838 52.1135 78.6514 51.3479 78.6514 50.0524V49.4635C78.12 50.1113 77.2933 50.4057 76.4666 50.4057C74.6362 50.4057 73.6914 48.9924 73.6914 47.4613C73.6914 45.9301 74.6362 44.2812 76.5847 44.2812C77.7066 44.2812 78.3562 44.6935 78.7105 45.3413V44.4579H79.8324V50.1113H79.7733ZM78.5333 47.4024C78.5333 46.1657 77.8838 45.0468 76.6438 45.0468C75.4628 45.0468 74.8724 46.2835 74.8724 47.2846C74.8724 48.4035 75.5809 49.4046 76.6438 49.4046C77.7657 49.4635 78.5333 48.5213 78.5333 47.4024Z" fill="#9C9B9B"/><path d="M83.0205 44.3443H84.1424V45.2866C84.4376 44.6388 85.1462 44.2266 85.8548 44.2266C86.2091 44.2266 86.3862 44.2855 86.6224 44.2855V45.2866C86.3862 45.2277 86.15 45.1688 85.9729 45.1688C84.91 45.1688 84.2015 46.111 84.2015 47.6421V50.4099H83.0205V44.3443Z" fill="#9C9B9B"/><path d="M94.1814 50.1155C93.709 50.2921 93.1776 50.5277 92.1147 50.5277C89.8119 50.5277 88.749 49.2321 88.749 47.2888C88.749 45.5221 89.93 44.2266 91.7604 44.2266C93.8862 44.2266 94.5947 45.6988 94.5947 47.6421H89.989C89.989 48.8199 90.9928 49.6443 92.1147 49.6443C92.8824 49.6443 93.8271 49.291 94.1224 49.0555V50.1155H94.1814ZM93.4138 46.7588C93.4138 45.8166 92.8233 45.051 91.8195 45.051C90.6385 45.051 90.1662 45.9343 90.1071 46.7588H93.4138Z" fill="#9C9B9B"/><path d="M102.507 50.1155C102.034 50.2921 101.503 50.5277 100.44 50.5277C98.1371 50.5277 97.0742 49.2321 97.0742 47.2888C97.0742 45.5221 98.2552 44.2266 100.086 44.2266C102.27 44.2266 102.92 45.6988 102.92 47.6421H98.3142C98.3142 48.8199 99.318 49.6443 100.44 49.6443C101.208 49.6443 102.152 49.291 102.448 49.0555V50.1155H102.507ZM101.739 46.7588C101.739 45.8166 101.149 45.051 100.145 45.051C98.9637 45.051 98.4914 45.9343 98.4323 46.7588H101.739Z" fill="#9C9B9B"/><path d="M105.872 44.3407H107.053V45.283C107.407 44.5763 108.293 44.1641 109.179 44.1641C110.832 44.1641 111.6 45.1652 111.6 46.7552V50.3474H110.419V47.2263C110.419 45.8129 110.064 45.1063 109.061 45.0474C107.703 45.0474 107.112 46.0485 107.112 47.5207V50.2885H105.931V44.3407H105.872Z" fill="#9C9B9B"/><path d="M124.649 50.1155C124.177 50.2921 123.645 50.5277 122.583 50.5277C120.28 50.5277 119.217 49.2321 119.217 47.2888C119.217 45.5221 120.398 44.2266 122.228 44.2266C124.354 44.2266 125.063 45.6988 125.063 47.6421H120.457C120.457 48.8199 121.461 49.6443 122.583 49.6443C123.35 49.6443 124.295 49.291 124.59 49.0555V50.1155H124.649ZM123.882 46.7588C123.882 45.8166 123.291 45.051 122.287 45.051C121.106 45.051 120.634 45.9343 120.575 46.7588H123.882Z" fill="#9C9B9B"/><path d="M128.783 45.2262H127.248V44.3429H128.783V43.8129C128.783 42.3407 129.197 41.3984 130.968 41.3984C131.263 41.3984 131.499 41.4573 131.736 41.4573L131.677 42.3407C131.559 42.2818 131.322 42.2818 131.086 42.2818C130.082 42.2818 129.905 42.8707 129.905 43.6951V44.3429H131.618V45.2262H129.905V50.3495H128.724V45.2262H128.783Z" fill="#9C9B9B"/><path d="M134.746 45.2262H133.211V44.3429H134.746V43.8129C134.746 42.3407 135.16 41.3984 136.931 41.3984C137.226 41.3984 137.462 41.4573 137.758 41.4573L137.699 42.3407C137.58 42.2818 137.344 42.2818 137.108 42.2818C136.104 42.2818 135.927 42.8707 135.927 43.6951V44.3429H137.64V45.2262H135.927V50.3495H134.746V45.2262Z" fill="#9C9B9B"/><path d="M140.297 50.3478H141.478V44.3411H140.297V50.3478ZM140.238 42.9867H141.596V41.75H140.238V42.9867Z" fill="#9C9B9B"/><path d="M149.095 45.346C148.623 45.1694 148.209 45.1105 147.796 45.1105C146.438 45.1105 145.729 46.2294 145.729 47.3483C145.729 48.4083 146.32 49.586 147.855 49.586C148.268 49.586 148.741 49.4683 149.154 49.2327L149.272 50.2338C148.8 50.4694 148.209 50.4694 147.796 50.4694C145.847 50.4694 144.489 49.056 144.489 47.2894C144.489 45.4638 145.788 44.1094 147.796 44.1094C148.268 44.1094 148.918 44.2272 149.213 44.3449L149.095 45.346Z" fill="#9C9B9B"/><path d="M151.989 50.3478H153.17V44.3411H151.989V50.3478ZM151.93 42.9867H153.288V41.75H151.93V42.9867Z" fill="#9C9B9B"/><path d="M161.613 50.1155C161.141 50.2921 160.609 50.5277 159.546 50.5277C157.244 50.5277 156.181 49.2321 156.181 47.2888C156.181 45.5221 157.362 44.2266 159.192 44.2266C161.377 44.2266 162.026 45.6988 162.026 47.6421H157.421C157.421 48.8199 158.424 49.6443 159.546 49.6443C160.314 49.6443 161.259 49.291 161.554 49.0555V50.1155H161.613ZM160.845 46.7588C160.845 45.8166 160.255 45.051 159.251 45.051C158.07 45.051 157.598 45.9343 157.539 46.7588H160.845Z" fill="#9C9B9B"/><path d="M164.979 44.3407H166.16V45.283C166.515 44.5763 167.4 44.1641 168.286 44.1641C169.939 44.1641 170.707 45.1652 170.707 46.7552V50.3474H169.526V47.2263C169.526 45.8129 169.172 45.1063 168.168 45.0474C166.81 45.0474 166.219 46.0485 166.219 47.5207V50.2885H165.039V44.3407H164.979Z" fill="#9C9B9B"/><path d="M178.088 45.346C177.615 45.1694 177.202 45.1105 176.789 45.1105C175.431 45.1105 174.722 46.2294 174.722 47.3483C174.722 48.4083 175.371 49.586 176.907 49.586C177.32 49.586 177.792 49.4683 178.206 49.2327L178.324 50.2338C177.851 50.4694 177.261 50.4694 176.848 50.4694C174.899 50.4694 173.541 49.056 173.541 47.2894C173.541 45.4638 174.84 44.1094 176.848 44.1094C177.32 44.1094 177.97 44.2272 178.265 44.3449L178.088 45.346Z" fill="#9C9B9B"/><path d="M180.39 51.9993C180.567 52.0582 180.745 52.1171 180.922 52.1171C181.985 52.1171 182.339 50.7626 182.339 50.6449C182.339 50.5271 182.162 50.2326 182.103 49.9971L179.918 44.3438H181.217L182.929 49.3493L184.701 44.3438H185.882L183.52 50.5271C183.047 51.7049 182.634 53.0004 181.04 53.0004C180.686 53.0004 180.449 52.9415 180.213 52.9415L180.39 51.9993Z" fill="#9C9B9B"/></svg></span>
<div class="eyebrow"><span>Vorschau</span></div>
<h1>Geschützter Bereich</h1>
<p>Diese Vorschau ist passwortgeschützt. Bitte geben Sie das Passwort ein.</p>
<form method="post" action="${LOGIN_PATH}" class="${failed ? 'error' : ''}">
<input type="hidden" name="next" value="${escapeHtml(target)}">
<label for="password">Passwort</label>
<input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
${failed ? '<span class="msg" role="alert">Das Passwort ist nicht korrekt.</span>' : ''}
<button type="submit">Anmelden</button>
</form>
</main>
</body>
</html>`;
  return new Response(html, {
    status: 401,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const passwordHash = PASSWORD_HASH;
  const sessionToken = await sha256(`${passwordHash}:agitec-preview`);

  if (url.pathname === LOGIN_PATH) {
    if (request.method !== 'POST') return Response.redirect(new URL('/', request.url), 303);
    const form = await request.formData();
    const target = safeTarget(form.get('next'));
    const password = String(form.get('password') || '');
    if ((await sha256(password)) !== passwordHash) return loginPage(target, true);
    return new Response(null, {
      status: 303,
      headers: {
        location: target,
        'set-cookie': `${COOKIE_NAME}=${sessionToken}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
        'cache-control': 'no-store',
      },
    });
  }

  if (readCookie(request, COOKIE_NAME) === sessionToken) return next();

  return loginPage(url.pathname + url.search, false);
}
