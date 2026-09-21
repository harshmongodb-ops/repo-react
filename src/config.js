// Single place for the backend's base URL - update this if the deployment
// domain changes instead of hunting through every page.
//
// NOTE: this is the current per-deployment Vercel URL (it changes on every
// deploy). Swap it for the stable Production domain from Vercel ->
// Settings -> Domains (something like https://ojt-backend-chi.vercel.app)
// so this doesn't need updating again after the next deploy.
export const API_ORIGIN = 'https://ojt-backend-elo9rhaxp-lj-661c.vercel.app'
export const API_BASE = `${API_ORIGIN}/api/userdata`
