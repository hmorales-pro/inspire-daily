import { useEffect, useState } from "react";
import { getAppSettings } from "@/lib/settings";

export const Copyright = () => {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const appVersion = await getAppSettings('app_version');
        setVersion(appVersion);
      } catch (error) {
        console.error('Error fetching app version:', error);
      }
    };

    fetchVersion();
  }, []);

  return (
    <div className="mt-8 border-t border-gray-200 pt-8 flex justify-center items-center space-x-2">
      <p className="text-base text-gray-400">
        © {new Date().getFullYear()} Inspire Daily. Tous droits réservés.
      </p>
      {version && (
        <span className="text-xs text-gray-400">
          v{version}
        </span>
      )}
    </div>
  );
};