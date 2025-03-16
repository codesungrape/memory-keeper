import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error logging out:", error.message);
      } else {
        router.push("/signin");
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
