// export function resolvePhotoUrl(url: string): string {
//   if (!url) return "";
//   const clean = url.trim();
//   if (clean.startsWith("url(")) {
//     const match = clean.match(/^url\(['"]?([^'"]+)['"]?\)(.*)$/);
//     if (match) {
//       return match[1] + match[2];
//     }
//   }
//   return clean;
// }
export function resolvePhotoUrl(url: string): string {
  if (!url) return "";

  let clean = url.trim();

  if (clean.startsWith("url(")) {
    const match = clean.match(/^url\(['"]?([^'"]+)['"]?\)$/);
    if (match) {
      clean = match[1];
    }
  }

  // URL absolut
  if (/^https?:\/\//i.test(clean)) {
    return clean;
  }

  // Hindari double wedding
  clean = clean.replace(/^\/?(dist\/)?/, "");
  clean = clean.replace(/^wedding\//, "");

  return `/wedding/${clean}`;
}
export function copyToClipboard(text: string, onSuccess: () => void): void {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(onSuccess)
      .catch(() => fallbackCopyToClipboard(text, onSuccess));
  } else {
    fallbackCopyToClipboard(text, onSuccess);
  }
}

function fallbackCopyToClipboard(text: string, onSuccess: () => void): void {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  // Ensure the textarea is off-screen and does not cause scrolling jump on mobile iOS
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = "0";
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  // High compatibility setSelectionRange for mobile browsers
  try {
    textArea.setSelectionRange(0, 99999);
  } catch (e) {}

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      onSuccess();
    }
  } catch (err) {
    console.warn("Clipboard copy fallback failed", err);
  }
  document.body.removeChild(textArea);
}
