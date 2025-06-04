export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  // The .well-known/farcaster.json route is used to provide the configuration for the Frame.
  // You need to generate the accountAssociation payload and signature using this link:

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjEwNTgyODcsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhlMEQ5NWUyZERhMmVjNzQzNDllQ2QwNDkzMjJGMzU1OTVDMDQzYTY4In0",
      payload:
        "eyJkb21haW4iOiJjZWxvLWZhcmNhc3Rlci1mcmFtZXMtZml2ZS52ZXJjZWwuYXBwIn0",
      signature:
        "MHg1ZGVjYzA2ZjMyNzlkYTI2NzA4NzdmZTdmZDg3YTgxMjA3MTc4ZGVhYjVmOWUxNmI0OTc3ZGFkYTM0ZTk3MzQ5NGM2YTgxNTk5MTczODEwNGMwMTZlMmY2ZTcxZWE0MDE0NDI5N2YyYTg3Njk3ODRkYjZmNzE5ZTEwMDQ0NDI3YTFj",
    },
    frame: {
      version: "1",
      name: "Shipper",
      iconUrl: `${appUrl}/splash.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/splash.png`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
