export async function uploadFile(file: File, path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Basic file type validation (prevent execution of arbitrary files)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return reject(new Error('نوع الملف غير مدعوم للحماية (Supported: JPG, PNG, WEBP, GIF, PDF)'));
    }

    // Limit size to 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return reject(new Error('حجم الملف كبير جداً. الحد الأقصى هو 5 ميجابايت.'));
    }

    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
