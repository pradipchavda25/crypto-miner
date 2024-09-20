"use client";

import { useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

declare global {
  interface Window {
    fbAsyncInit: () => void;
  }
  const FB: {
    init: (params: { appId: string; xfbml: boolean; version: string }) => void;
    AppEvents: {
      logPageView: () => void;
    };
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Telegram Web App script
    const telegramScript = document.createElement("script");
    telegramScript.src = "https://telegram.org/js/telegram-web-app.js";
    telegramScript.async = true;
    document.body.appendChild(telegramScript);

    // Facebook SDK initialization
    window.fbAsyncInit = function () {
      if (typeof FB !== "undefined") {
        FB.init({
          appId: "1266132247886959", 
          xfbml: true,
          version: "v20.0", 
        });
        FB.AppEvents.logPageView(); 
      }
    };

    const facebookScript = document.createElement("script");
    facebookScript.id = "facebook-jssdk";
    facebookScript.src = "https://connect.facebook.net/en_US/sdk.js";
    facebookScript.async = true;

    const fjs = document.getElementsByTagName("script")[0];
    if (fjs && fjs.parentNode) {
      fjs.parentNode.insertBefore(facebookScript, fjs);
    } else {
      document.body.appendChild(facebookScript);
    }

    return () => {
      if (telegramScript.parentNode) {
        telegramScript.parentNode.removeChild(telegramScript);
      }
      const fbScript = document.getElementById("facebook-jssdk");
      if (fbScript && fbScript.parentNode) {
        fbScript.parentNode.removeChild(fbScript);
      }
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Crypto Miner</title>
        <meta name="description" content="Crypto Miner app" />
        <link rel="icon" href="./btc-logo.svg" type="image/svg+xml" />
        <script src="https://connect.facebook.net/en_US/fbinstant.6.3.js" async></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}