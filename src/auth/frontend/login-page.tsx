import { GoogleSignInButton } from "wasp/client/auth";
import { Card } from "../../components/ui/card";

export function Login() {
  return (
    <Card className="w-full max-w-md mx-auto mt-[10%] p-8 backdrop-blur-lg bg-white/30 border border-white/50 shadow-xl rounded-2xl">
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Society360</h1>
          <p className="text-gray-600 mb-6">
            Smart society management solution
          </p>
        </div>
        <div className="w-full px-4">
          <GoogleSignInButton />
        </div>
        <div className="text-center text-sm text-gray-600 mt-6">
          <p>Secure login for property owners, tenants, and staff</p>
        </div>
      </div>
    </Card>
  );
}
