export const Copyright = () => {
  return (
    <div className="mt-8 border-t border-gray-200 pt-8 flex justify-center items-center space-x-2">
      <p className="text-base text-gray-400">
        © {new Date().getFullYear()} Inspire Daily. Tous droits réservés.
      </p>
      {import.meta.env.VITE_APP_VERSION && (
        <span className="text-xs text-gray-400">
          v{import.meta.env.VITE_APP_VERSION}
        </span>
      )}
    </div>
  );
};