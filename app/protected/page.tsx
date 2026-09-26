import { LogoutButton } from "@/components/logout-button";

export default function ProtectedPage() {
  return (
    <main className="p-6">
      <LogoutButton />
    </main>
  );
}
