// helper to normalize avatar value into a string or File
export const normalizeAvatarValue = (avatar: any): string | File | null => {
  if (!avatar && avatar !== 0) return null;

  // if it's already a File (new upload)
  if (avatar instanceof File) return avatar;

  // if it's a plain string (url/path)
  if (typeof avatar === "string") return avatar;

  // if it's an object coming from your UI, try to extract best field
  if (typeof avatar === "object") {
    // common shapes: { path: '...', url: '...', fullPath: '...', id: 123 }
    if ("path" in avatar && typeof avatar.path === "string") return avatar.path;
    if ("url" in avatar && typeof avatar.url === "string") return avatar.url;
    if ("fullPath" in avatar && typeof avatar.fullPath === "string")
      return avatar.fullPath;
    if (
      "id" in avatar &&
      (typeof avatar.id === "string" || typeof avatar.id === "number")
    )
      return String(avatar.id);

    // fallback: stringify (not ideal, but safe)
    try {
      return JSON.stringify(avatar);
    } catch (e) {
      return String(avatar);
    }
  }

  return null;
};
