"use client";

import { useEffect } from "react";

export default function N8nChat() {
  useEffect(() => {
    // Poll for the chat toggle button and replace the icon
    const intervalId = setInterval(() => {
      const toggleBtn = document.querySelector(".chat-window-toggle");
      if (toggleBtn) {
        // Check if we already replaced it to avoid constant re-rendering or flickering
        if (!toggleBtn.getAttribute("data-icon-replaced")) {
          toggleBtn.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/512/10479/10479785.png" width="24" height="24" />
            
          `;
          toggleBtn.setAttribute("data-icon-replaced", "true");

          // Optional: Add some flex centering styles directly if needed, though CSS handles most
          // Reveal the button only after icon is swapped
          (toggleBtn as HTMLElement).style.setProperty(
            "display",
            "flex",
            "important"
          );
          (toggleBtn as HTMLElement).style.setProperty(
            "align-items",
            "center",
            "important"
          );
          (toggleBtn as HTMLElement).style.setProperty(
            "justify-content",
            "center",
            "important"
          );
        }
      }
    }, 500);

    // Stop polling after 1 minute to save resources
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, 60000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    // Check if the script is already injected to prevent duplicates
    if (document.getElementById("n8n-chat-script")) return;

    const script = document.createElement("script");
    script.id = "n8n-chat-script";
    script.type = "module";
    script.innerHTML = `
      import { createChat } from "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js";
      
      createChat({
        webhookUrl: "https://arambot.cloud/webhook/6c61dc35-5739-40c0-8fbe-b1019919c8b5/chat",
        webhookConfig: {
          method: "POST",
          headers: {}
        },
        target: "#n8n-chat",
        mode: "window",
        chatInputKey: "chatInput",
        chatSessionKey: "sessionId",
        loadPreviousSession: true,
        metadata: {},
        showWelcomeScreen: false,
        defaultLanguage: "ar",
        initialMessages: [
          "!مرحباً بك في شركة آرام الخليج للتسويق ",
          "كيف يمكنني مساعدتك اليوم ؟"
        ],
        i18n: {
          ar: {
            title: "", // Empty title to allow logo to be the focus
            subtitle: "",
            footer: "",
            getStarted: "محادثة جديدة",
            inputPlaceholder: "...اكتب سؤالك",
          },
        },
        enableStreaming: false,
      });
    `;

    document.body.appendChild(script);

    return () => {
      // Cleanup logic if needed
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --chat--color-primary: #feb803;
          --chat--color-primary-shade-50: #e5a602;
          --chat--color-primary-shade-100: #cc9402;

          --chat--color-secondary: #000000;
          --chat--color-secondary-shade-50: #333333;

          --chat--color-white: #ffffff;
          --chat--color-light: #fdf8e6;
          --chat--color-light-shade-50: #fbeebf;
          --chat--color-light-shade-100: #f9e499;
          --chat--color-medium: #d1d5db;
          --chat--color-dark: #000000;
          --chat--color-disabled: #94a3b8;
          --chat--color-typing: #000000;

          --chat--spacing: 1rem;
          --chat--border-radius: 1rem;
          --chat--transition-duration: 0.2s;

          --chat--window--width: 400px;
          --chat--window--height: 600px;

          --chat--header-height: 80px;
          --chat--header--padding: var(--chat--spacing);
          --chat--header--background: #feb803; /* Yellow Header */
          --chat--header--color: #000000; /* Black Text */
          --chat--header--border-top: none;
          --chat--header--border-bottom: 1px solid rgba(0, 0, 0, 0.1);

          --chat--textarea--height: 50px;

          --chat--message--font-size: 1rem;
          --chat--message--padding: var(--chat--spacing);
          --chat--message--border-radius: 12px;
          --chat--message-line-height: 1.6;

          /* User Message: Black Bubble, White Text */
          --chat--message--user--background: #000000;
          --chat--message--user--color: #ffffff;

          /* Bot Message: White Bubble, Black Text (on light bg) */
          --chat--message--bot--background: #ffffff;
          --chat--message--bot--color: #000000;
          --chat--message--bot--border: 1px solid rgba(0, 0, 0, 0.08);

          /* Toggle Button: Yellow Circle, Black Icon */
          --chat--toggle--background: #feb803;
          --chat--toggle--hover--background: #ffc42e; /* slightly lighter yellow on hover */
          --chat--toggle--active--background: #e5a602;
          --chat--toggle--color: #000000;
          --chat--toggle--size: 56px;
          --chat--toggle--shadow: 0 4px 12px rgba(254, 184, 3, 0.4);
        }

        /* Customize scrollbars */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #feb803;
          border-radius: 3px;
        }

        /* Custom Header Styling for Logo */
        .chat-header {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          background-color: #feb803 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        /* Hide the text h1 */
        .chat-header .chat-heading h1 {
          display: none !important;
        }

        .chat-body {
          background-color: #fff !important;
        }

        .chat-message-from-user {
          background-color: #feb803 !important;
          color: #fff !important;
          border-radius: 12px !important;
        }

        .chat-window-toggle {
          background-color: #feb803 !important;
          color: #fff !important;
          width: 55px !important;
          height: 55px !important;
          max-width: 55px !important;
          max-height: 55px !important;
          opacity: 0.7 !important;
          display: none !important; /* Hidden initially */
          justify-content: center !important;
          align-items: center !important;
        }

        .chat-window-wrapper {
          right: 20px !important;
        }

        .chat-window-toggle:hover {
          opacity: 1 !important;
        }

        .chat-message-from-bot {
          background-color: #ddd !important;
          border-radius: 12px !important;
        }

        /* Inject Logo via ::after or background on heading */
        .chat-header .chat-heading {
          width: 120px;
          height: 48px;
          /* Assuming logo is dark or has transparency to look good on yellow */
          background-image: url("/logo.png");
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          margin: 0 auto;
        }
      `}</style>

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css"
      />

      <div className="z-99999 font-outfit">
        <div id="n8n-chat" />
      </div>
    </>
  );
}
