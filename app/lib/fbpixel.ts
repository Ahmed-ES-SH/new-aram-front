export const FB_PIXEL_ID = "1573904527104685"; // ضع ID الخاص بك هنا

// Function to send pageview
export const pageview = () => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "PageView");
  }
};

// Function to send custom events
export const event = (name: string, options: Record<string, any>) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", name, options);
  }
};
