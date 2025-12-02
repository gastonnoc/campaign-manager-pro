# Campaign Manager Pro - Deployment Guide

Simple deployment guide for getting your Campaign Manager Pro application online.

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy from v0

1. Click the "Publish" button in v0
2. Connect your GitHub account
3. Select "Deploy to Vercel"
4. Your app will be live in 2-3 minutes at `your-app.vercel.app`

### Option 2: Deploy from GitHub

1. Push your code to GitHub:
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/campaign-manager-pro.git
git push -u origin main
\`\`\`

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub

3. Click "New Project" and import your repository

4. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Click "Deploy"

Your app will be live at `https://your-project.vercel.app`

## Deploy to Netlify

1. Build your project:
\`\`\`bash
npm run build
\`\`\`

2. Install Netlify CLI:
\`\`\`bash
npm install -g netlify-cli
\`\`\`

3. Deploy:
\`\`\`bash
netlify deploy --prod
\`\`\`

Or drag and drop the `out` folder to [netlify.com/drop](https://netlify.com/drop)

## Deploy to GitHub Pages

1. Update `next.config.mjs`:
\`\`\`javascript
const nextConfig = {
  output: 'export',
  basePath: '/campaign-manager-pro',
  images: {
    unoptimized: true,
  },
}
\`\`\`

2. Build and export:
\`\`\`bash
npm run build
\`\`\`

3. Push the `out` folder to `gh-pages` branch

4. Enable GitHub Pages in repository settings

## Environment Variables

The application works without environment variables for development. For production with a database, add:

\`\`\`
DATABASE_URL=your_database_connection_string
\`\`\`

### Adding Environment Variables in Vercel

1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add your variables
4. Redeploy

### Adding Environment Variables in Netlify

1. Go to Site Settings → Environment Variables
2. Add your variables
3. Trigger a new deploy

## Database Options (Optional)

The app uses in-memory storage by default. To add persistence:

### Vercel Postgres

1. Go to your Vercel project
2. Storage → Create Database → Postgres
3. Copy the connection string
4. Add as `DATABASE_URL` environment variable
5. Update `lib/db.ts` to use the database

### Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings
4. Add as `DATABASE_URL` environment variable
5. Update `lib/db.ts` to use Supabase client

### PlanetScale

1. Create account at [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Add as `DATABASE_URL` environment variable
5. Update `lib/db.ts` to use MySQL client

## Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatic

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Update DNS records
4. SSL certificate is automatic

## Performance Tips

1. Enable compression in hosting platform
2. Use CDN (automatic with Vercel/Netlify)
3. Optimize images before uploading
4. Enable caching headers
5. Monitor performance with Vercel Analytics

## Troubleshooting

### Build fails
- Check Node.js version (18+)
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check for TypeScript errors

### App not loading
- Check browser console for errors
- Verify environment variables
- Check API routes are working

### Deployment timeout
- Increase build timeout in platform settings
- Optimize build process
- Check for infinite loops

## Cost

All recommended platforms have generous free tiers:

- **Vercel**: Free for personal projects
- **Netlify**: Free for personal projects  
- **GitHub Pages**: Free for public repositories

## Security

For production:
1. Add authentication
2. Validate all inputs
3. Use HTTPS only
4. Enable CORS properly
5. Add rate limiting
6. Regular security updates

## Monitoring

Free monitoring options:
- Vercel Analytics (built-in)
- Google Analytics
- Plausible Analytics
- Sentry for error tracking

## Support

For issues:
1. Check deployment logs
2. Review documentation
3. Open GitHub issue
4. Contact platform support

## Next Steps

After deployment:
1. Test all features
2. Add custom domain
3. Set up monitoring
4. Configure backups (if using database)
5. Share with team or portfolio
