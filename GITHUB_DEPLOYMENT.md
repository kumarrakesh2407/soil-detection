# GitHub Deployment Guide

This guide will help you deploy the Soil Detection System to GitHub Pages for free hosting.

## Prerequisites

- GitHub account
- Git installed on your local machine
- Project files ready for deployment

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Enter repository name: `XXXXXX XXXX`
5. Add description: "- - - -- - - - - -"
6. Choose "Public" (required for GitHub Pages)
7. Click "Create repository"

## Step 2: Configure Local Repository

1. Navigate to your project directory:
```bash
cd "D:\Projects\Soil Detection"
```

2. Add GitHub remote repository:
```bash
git remote add origin https://github.com/yourusername/soil-detection.git
```
Replace `yourusername` with your actual GitHub username.

3. Set main branch:
```bash
git branch -M main
```

## Step 3: Stage and Commit Changes

1. Add all files to staging:
```bash
git add .
```

2. Commit changes:
```bash
git commit -m "Initial commit: Complete soil detection system"
```

## Step 4: Push to GitHub

1. Push to GitHub:
```bash
git push -u origin main
```

2. Enter your GitHub username and password/token when prompted

## Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Build and deployment", select "Source" as "Deploy from a branch"
5. Select "Branch" as "main"
6. Select "Folder" as "/ (root)"
7. Click "Save"

## Step 6: Access Your Deployed Site

1. Wait a few minutes for deployment to complete
2. Go to the "Pages" section in Settings
3. Your site will be available at: `https://yourusername.github.io/soil-detection`

## Alternative: Using gh-pages Branch

If you prefer to use a separate branch for GitHub Pages:

1. Create and switch to gh-pages branch:
```bash
git checkout --orphan gh-pages
```

2. Remove all files except frontend:
```bash
git rm -rf .
git add frontend/
git commit -m "Deploy to GitHub Pages"
```

3. Push gh-pages branch:
```bash
git push origin gh-pages
```

4. In GitHub Settings > Pages, select "gh-pages" branch

## Troubleshooting

### Common Issues

1. **404 Error**: Wait a few minutes for GitHub Pages to process
2. **CSS/JS Not Loading**: Check file paths and ensure they're relative
3. **Repository Not Found**: Verify remote URL is correct
4. **Permission Denied**: Check GitHub token permissions

### File Structure for GitHub Pages

For proper deployment, ensure your frontend files are in the root:
```
soil-detection/
|-- index.html
|-- style.css
|-- script.js
|-- assets/
|-- README.md
```

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the root:
```
yourdomain.com
```

2. Add the CNAME file to Git:
```bash
git add CNAME
git commit -m "Add custom domain"
git push origin main
```

3. Configure DNS settings with your domain provider

## Automated Deployment

For automatic deployment on every push:

1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

2. Commit and push the workflow file
3. GitHub Actions will automatically deploy your site

## Backend Deployment

For full-stack deployment:

### Heroku (Free Tier)

1. Install Heroku CLI
2. Login to Heroku:
```bash
heroku login
```

3. Create Heroku app:
```bash
heroku create your-app-name
```

4. Deploy backend:
```bash
cd backend
heroku deploy:jar target/your-app.jar
```

### Vercel (Frontend + API)

1. Install Vercel CLI
2. Deploy:
```bash
vercel --prod
```

## Environment Variables

Set up environment variables for production:

### GitHub Pages
- Add API keys in your JavaScript files (not recommended for sensitive data)
- Use public APIs that don't require authentication

### Heroku/Vercel
- Set environment variables in deployment platform settings
- Use `.env` file for local development

## Performance Optimization

1. **Minify CSS/JS**: Use build tools to reduce file sizes
2. **Optimize Images**: Compress images and use WebP format
3. **Enable Caching**: Add cache headers for static assets
4. **Use CDN**: Consider using CDN for faster loading

## Security Considerations

1. **API Keys**: Never commit sensitive API keys to public repositories
2. **HTTPS**: GitHub Pages automatically provides HTTPS
3. **CORS**: Configure CORS headers for API endpoints
4. **Input Validation**: Validate all user inputs on both frontend and backend

## Monitoring and Analytics

1. **Google Analytics**: Add tracking code to monitor usage
2. **GitHub Insights**: Monitor repository traffic
3. **Error Tracking**: Set up error logging for production issues

## Maintenance

1. **Regular Updates**: Keep dependencies updated
2. **Backup**: Regular backup of repository and data
3. **Testing**: Test deployment after major changes
4. **Documentation**: Keep documentation updated

---

## Quick Start Summary

```bash
# 1. Create repository on GitHub
# 2. Add remote and push
git remote add origin https://github.com/yourusername/soil-detection.git
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin main

# 3. Enable GitHub Pages in repository settings
# 4. Access at: https://yourusername.github.io/soil-detection
```

Your Soil Detection System is now live on GitHub Pages!
