// Activation is a deployment choice: GitHub Pages cannot serve the account backend.
export function accountNavigation(value = process.env.ACCOUNT_BASE_URL) {
  if (!value) return '';
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('ACCOUNT_BASE_URL must be a trusted HTTPS account origin');
  }
  return `<a class="nav-account" href="${url.origin}/login">Sign in</a>`;
}
