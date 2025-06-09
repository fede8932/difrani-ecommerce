import React, { useEffect, useState } from "react";
import { toast, Toaster, Toast } from "react-hot-toast";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

const InstallPWAToast: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [toastId, setToastId] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      e.preventDefault();
      setDeferredPrompt(event);

      if (!toastId) {
        const id = toast.custom((t: Toast) => (
          <div
            style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "300px",
            }}
          >
            <span>¿Querés instalar esta aplicación?</span>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={async () => {
                  if (event) {
                    await event.prompt();
                    const { outcome } = await event.userChoice;
                    if (outcome === "accepted") {
                      console.log("✅ Instalación aceptada");
                    } else {
                      console.log("❌ Instalación rechazada");
                    }
                    toast.dismiss(t.id);
                    setDeferredPrompt(null);
                    setToastId(null);
                  }
                }}
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Aceptar
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  setDeferredPrompt(null);
                  setToastId(null);
                }}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ), {
          duration: Infinity,
          position: "top-center",
        });

        setToastId(id);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    console.log("ACIV")
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [toastId]);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone && toastId) {
      toast.dismiss(toastId);
    }
  }, [toastId]);

  return <Toaster />;
};

export default InstallPWAToast;
