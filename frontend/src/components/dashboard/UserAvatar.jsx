import { useEffect, useState } from 'react';

function getInitials(fullName) {
  if (!fullName) {
    return 'U';
  }

  return fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function UserAvatar({ fullName, photoUrl, sizeClassName = 'h-14 w-14', fallbackClassName = '', imageClassName = '' }) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [photoUrl]);

  const initials = getInitials(fullName);
  const shouldShowImage = Boolean(photoUrl) && !imageError;

  if (!shouldShowImage) {
    return (
      <div
        className={`${sizeClassName} grid shrink-0 place-items-center rounded-2xl avatar-fallback text-sm font-semibold shadow-lg ${fallbackClassName}`}
        aria-label={fullName || 'User avatar'}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt={fullName || 'User avatar'}
      className={`${sizeClassName} shrink-0 rounded-2xl object-cover shadow-sm ${imageClassName}`}
      onError={() => setImageError(true)}
      referrerPolicy="no-referrer"
    />
  );
}
