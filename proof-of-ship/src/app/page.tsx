import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;

//
// This is the main frame — the one that appears embedded when we share our link.
//
const frame = {
  version: "next",
  // This is the image displayed when sharing the link.
  imageUrl: `${appUrl}/splash.png`,
  // Loading image that will be shown while the frame is loading
  loadingImageUrl: `${appUrl}/loading.gif`,
  // This is the button displayed when sharing the link.
  button: {
    title: "Weekly Builder Rewards",
    action: {
      type: "launch_frame",
      name: "Weekly Builder Rewards",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Weekly Builder Rewards",
    openGraph: {
      title: "Weekly Builder Rewards",
      description: "Weekly Builder Rewards",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
