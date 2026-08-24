import { useEffect } from 'react';

interface LinkedInBadgeProps {
  size?: 'small' | 'medium' | 'large';
  type?: 'HORIZONTAL' | 'VERTICAL';
  theme?: 'dark' | 'light';
  vanity?: string;
  className?: string;
}

export default function LinkedInBadge({
  size = 'medium',
  type = 'VERTICAL',
  theme = 'dark',
  vanity = 'ashin-r-05a4b9325',
  className = '',
}: LinkedInBadgeProps) {
  useEffect(() => {
    // Ensure script is loaded and badge is rendered
    const scriptId = 'linkedin-badge-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const reloadBadge = () => {
      if (typeof (window as any).IN?.parse === 'function') {
        (window as any).IN.parse();
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://platform.linkedin.com/badges/js/profile.js';
      script.async = true;
      script.defer = true;
      script.type = 'text/javascript';
      script.onload = reloadBadge;
      document.body.appendChild(script);
    } else {
      reloadBadge();
    }
  }, []);

  return (
    <div className={`flex justify-center items-center w-full min-h-[280px] p-2 ${className}`}>
      <div
        className="badge-base LI-profile-badge"
        data-locale="en_US"
        data-size={size}
        data-theme={theme}
        data-type={type}
        data-vanity={vanity}
        data-version="v1"
      >
        <a
          className="badge-base__link LI-simple-link font-code text-xs text-blue-400 hover:underline"
          href={`https://in.linkedin.com/in/${vanity}?trk=profile-badge`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ashin R
        </a>
      </div>
    </div>
  );
}
