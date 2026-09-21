// Single place for the backend's base URL - update this if the deployment
// domain changes instead of hunting through every page.
//
// This is the stable Vercel Production domain (Settings -> Domains) - it
// always points at whatever is currently deployed, so it doesn't need
// updating again after future backend deploys.
export const API_ORIGIN = 'https://ojt-backend-chi.vercel.app'
export const API_BASE = `${API_ORIGIN}/api/userdata`
