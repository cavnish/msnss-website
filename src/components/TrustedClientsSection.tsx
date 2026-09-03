import { getClients } from "@/lib/queries";
import { TrustedClients } from "@/components/TrustedClients";

export async function TrustedClientsSection() {
  const clients = await getClients();
  if (!clients.length) return null;
  return <TrustedClients clients={clients} />;
}
