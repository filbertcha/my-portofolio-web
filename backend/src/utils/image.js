const SIGNATURES = [
  {
    extension: 'jpg',
    mime: 'image/jpeg',
    match: (buffer) =>
      buffer.length > 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff,
  },
  {
    extension: 'png',
    mime: 'image/png',
    match: (buffer) =>
      buffer.length > 8 &&
      buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  {
    extension: 'webp',
    mime: 'image/webp',
    match: (buffer) =>
      buffer.length > 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP',
  },
  {
    extension: 'gif',
    mime: 'image/gif',
    match: (buffer) =>
      buffer.length > 6 &&
      ['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString('ascii')),
  },
];

/**
 * Detect an image type from file contents (never trust the extension or the
 * client-provided mime type alone).
 * @param {Buffer} buffer
 * @returns {{extension: string, mime: string} | null}
 */
export function detectImage(buffer) {
  const detected = SIGNATURES.find((signature) => signature.match(buffer));
  return detected ? { extension: detected.extension, mime: detected.mime } : null;
}
