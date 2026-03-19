# EmailJS setup for the contact form

The contact form uses [EmailJS](https://www.emailjs.com/) to send submissions to **thehezekiahfoundation@gmail.com**. Follow these steps to connect it.

## 1. Create an EmailJS account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/) and sign up (free tier is enough).
2. Open the [Dashboard](https://dashboard.emailjs.com/).

## 2. Add an email service

1. In the dashboard, go to **Email Services** and click **Add New Service**.
2. Choose **Gmail** (or another provider).
3. Connect your Gmail account (**thehezekiahfoundation@gmail.com**) or use the email that should receive the messages.
4. Save and note the **Service ID** (e.g. `service_xxxxxxx`).

## 3. Create an email template

1. Go to **Email Templates** and click **Create New Template**.
2. Set **To Email** to `thehezekiahfoundation@gmail.com` (or leave empty if the service already sends to that address).
3. Set **Subject** to something like: `Contact form: {{from_name}}`.
4. In **Content**, use the variables that the form sends. For example:

   ```
   New message from the website contact form.

   Name: {{from_name}}
   Email: {{reply_to}}

   Message:
   {{message}}
   ```

   Available variables: `{{first_name}}`, `{{last_name}}`, `{{from_name}}`, `{{email}}`, `{{reply_to}}`, `{{message}}`.
5. Save and note the **Template ID** (e.g. `template_xxxxxxx`).

## 4. Get your Public Key

1. In the dashboard, go to **Account** → **API Keys** (or **General**).
2. Copy your **Public Key**.

## 5. Add the IDs to your site

Open **main.js** and find the `EMAILJS_CONFIG` object near the contact form code. Replace the placeholders:

```javascript
var EMAILJS_CONFIG = {
  publicKey: 'YOUR_PUBLIC_KEY',   // e.g. 'AbCdEfGh123456789'
  serviceId: 'YOUR_SERVICE_ID',   // e.g. 'service_abc123'
  templateId: 'YOUR_TEMPLATE_ID'  // e.g. 'template_xyz789'
};
```

Save the file. The contact form will then send submissions through EmailJS to your inbox.

## Testing

1. Open the Contact page on your site.
2. Fill in the form and click **Send**.
3. Check **thehezekiahfoundation@gmail.com** for the new message.

If something goes wrong, open the browser console (F12) to see any EmailJS errors.
