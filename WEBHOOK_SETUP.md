# Sanity Webhook Setup for Automatic Content Updates

This guide explains how to configure Sanity webhooks to automatically update your website when content changes in Sanity Studio.

## Prerequisites

1. Your website must be deployed to a publicly accessible URL (Vercel, Netlify, etc.)
2. The webhook handler API route is implemented at `/api/revalidate`
3. Environment variable `SANITY_REVALIDATE_SECRET` is configured

## Step 1: Generate a Secure Webhook Secret

### For Development:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### For Production:
Generate a secure random string and update your environment variables:
- `.env.local` for local development
- Your hosting platform's environment variables (Vercel/Netlify dashboard)

## Step 2: Configure Webhook in Sanity

1. **Go to Sanity Management Console**
   - Visit [manage.sanity.io](https://manage.sanity.io)
   - Select your project: `doahu3k3`

2. **Navigate to API Settings**
   - Click on "API" in the left sidebar
   - Select "Webhooks" tab

3. **Create New Webhook**
   - Click "Add webhook"
   - Fill in the details:

   **Webhook Configuration:**
   ```
   Name: Production Website Revalidation
   URL: https://your-domain.com/api/revalidate
   Dataset: production
   HTTP method: POST
   HTTP headers: (leave default)
   Secret: [paste your generated secret here]
   
   Trigger on:
   ☑️ Create
   ☑️ Update  
   ☑️ Delete
   
   Filter (Optional):
   Leave empty to trigger on all document types
   OR specify: _type in ["product", "category", "homePage", "aboutPage", "storeSettings"]
   ```

4. **Test the Webhook**
   - After saving, use the "Ping" button to test connectivity
   - Check your server logs for successful webhook receipt

## Step 3: Verify Setup

### Test the Integration:
1. **Edit Content in Sanity Studio**
   - Change a product name, price, or description
   - Publish the changes

2. **Check Website Updates**
   - Visit your website within 5-10 seconds
   - Verify the changes appear automatically
   - Check browser network tab - no full page reload should occur

3. **Monitor Webhook Logs**
   - Check your hosting platform's function logs
   - Look for successful revalidation messages

### Health Check Endpoint:
Visit `https://your-domain.com/api/revalidate` (GET request) to verify the webhook handler is active.

## Webhook Payload Structure

The webhook handler processes these document types:

- **`product`**: Revalidates product pages, category pages, and homepage
- **`category`**: Revalidates category pages and homepage  
- **`homePage`**: Revalidates homepage for both languages
- **`aboutPage`**: Revalidates about pages
- **`storeSettings`**: Revalidates pages using store settings (contact, footer, etc.)

## Troubleshooting

### Common Issues:

1. **"Invalid webhook signature"**
   - Ensure `SANITY_REVALIDATE_SECRET` matches in both Sanity and your app
   - Verify the secret is properly configured in production environment

2. **"Webhook secret not configured"**
   - Add `SANITY_REVALIDATE_SECRET` to your environment variables
   - Restart your application after adding the secret

3. **Pages not updating**
   - Check webhook is triggering (test with Ping button)
   - Verify your domain URL is correct and publicly accessible
   - Ensure CDN caching isn't preventing updates

4. **Webhook timeouts**
   - The handler should complete quickly (< 30 seconds)
   - Check server logs for any errors during revalidation

### Debug Steps:

1. **Check Webhook Delivery**
   - Go to manage.sanity.io → API → Webhooks
   - Click on your webhook to see delivery history
   - Look for failed deliveries and error messages

2. **Server Logs**
   - Check your hosting platform's function logs
   - Look for console.log messages from the webhook handler

3. **Test with curl**
   ```bash
   curl -X GET https://your-domain.com/api/revalidate
   ```

## Security Notes

- The webhook secret prevents unauthorized revalidation requests
- HMAC signature verification ensures requests come from Sanity
- Keep your webhook secret secure and rotate it periodically
- Only your production domain should be configured in the webhook URL

## Performance Impact

- Webhooks only revalidate affected pages, not the entire site
- Revalidation happens in the background without affecting user experience
- No manual deployments needed for content updates
- Reduces server load compared to time-based revalidation