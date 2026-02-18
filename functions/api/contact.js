export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const name = formData.get('name') || '';
    const community = formData.get('community') || '';
    const email = formData.get('email') || '';
    const units = formData.get('units') || '';
    const message = formData.get('message') || '';
    const honey = formData.get('_honey') || '';

    // Spam check
    if (honey) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Basic validation
    if (!name || !email) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send via Cloudflare Email (MailChannels — free for Cloudflare Pages)
    const emailBody = `
New Common Ground Lead

Name: ${name}
Community: ${community}
Email: ${email}
Number of Units: ${units}
Message: ${message}
    `.trim();

    const sendRequest = new Request('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'hello@commongroundhoa.com', name: 'Common Ground' }],
          },
        ],
        from: {
          email: 'noreply@commongroundhoa.com',
          name: 'Common Ground Website',
        },
        reply_to: {
          email: email,
          name: name,
        },
        subject: `New Lead: ${community || name}`,
        content: [
          {
            type: 'text/plain',
            value: emailBody,
          },
        ],
      }),
    });

    const response = await fetch(sendRequest);

    if (response.status === 202 || response.status === 200) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If MailChannels fails, fall back to logging
    console.log('MailChannels response:', response.status, await response.text());
    console.log('LEAD DATA:', emailBody);

    // Still return success — we logged it and can retrieve from Cloudflare logs
    return new Response(JSON.stringify({ success: true, note: 'logged' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
