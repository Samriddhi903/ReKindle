import { useEffect } from "react";

export default function OmniChatbotWidget() {
  useEffect(() => {
    if (document.getElementById("omnidimension-web-widget")) return;

    const script = document.createElement("script");
    script.id = "omnidimension-web-widget";
    script.async = true;
    script.src = "https://backend.omnidim.io/web_widget.js?secret_key=1b97fe79087649349e94690b7f603f31";
    document.body.appendChild(script);
  }, []);

  return null;
} 