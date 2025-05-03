export default function DeployTest() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Deployment Test Page</h1>
        
        <p className="text-gray-300 mb-6">
          This is a minimal page with no client-side functionality.
        </p>
        
        <div className="p-4 bg-gray-700 rounded-lg mb-6">
          <p className="text-green-400 font-bold">Loaded Successfully!</p>
          <p className="text-sm text-gray-400">
            Server timestamp: {new Date().toISOString()}
          </p>
        </div>
        
        <p className="text-gray-400 text-sm">
          This page was rendered on the server without any client-side hooks.
        </p>
      </div>
    </div>
  );
} 