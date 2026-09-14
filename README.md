# Full-Stack-Project-
QuicMed
Deploying on render
signup-fronted
Admin Pannel

## Render deployment settings

Create three services, or deploy the frontend and admin as separate static sites.

Backend web service:

- Root directory: `Backend`
- Build command: `npm install`
- Start command: `npm start`
- Required environment variables: `MONGODB_URI`, `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- Recommended environment variable: `FRONTEND_URL` set to the comma-separated public frontend and admin URLs

Frontend and admin static sites:

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Set `VITE_BACKEND_URL` to the backend URL, including `https://` and without a trailing slash, then redeploy
- Add a rewrite from `/*` to `/index.html` with status `200`; this is required because both apps use `BrowserRouter`

To verify the backend before testing the apps, open its root URL. It should return `API is Working....`.

