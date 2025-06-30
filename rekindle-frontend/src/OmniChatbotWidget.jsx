import { useEffect } from "react";

export default function OmniChatbotWidget() {
  useEffect(() => {
    if (document.getElementById("omnidimension-web-widget")) return;

    const script = document.createElement("script");
    script.id = "omnidimension-web-widget";
    script.async = true;
    script.src = `https://backend.omnidim.io/web_widget.js?secret_key=${import.meta.env.VITE_OMNIDIMENSION_SECRET_KEY}`;
    document.body.appendChild(script);
  }, []);

  return null;
} 