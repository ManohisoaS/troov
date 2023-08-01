/**
 * Middleware to redirect to /login if user is not logged
 * 
 * @param {object} { app, store, route, redirect, ...context } all page request by nuxt  
 * @returns page redirection
 */
export default function ({ app, store, route, redirect, ...context }) {
    const token = localStorage.getItem('access_token'); 
    if (!token) {
        return redirect('/login');
    }
}