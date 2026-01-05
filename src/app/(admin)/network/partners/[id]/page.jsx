import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import PartnerView from "./PartnerView";
import PartnerClient from "./PartnerClient";

export default async function PartnerDetailsPage({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // not needed for reads
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: partner } = await supabase
    .from("partner_organizations")
    .select("*")
    .eq("id", id)
    .single();

  if (!partner) {
    return <div className="text-red-600">Partner not found</div>;
  }

  // ✅ Generate signed URLs HERE (server-side)
  const panUrl = partner.pan_card_url
    ? (
        await supabase.storage
          .from("partner-pan")
          .createSignedUrl(partner.pan_card_url, 300)
      ).data?.signedUrl
    : null;

  const mouUrl = partner.mou_url
    ? (
        await supabase.storage
          .from("partner-mou")
          .createSignedUrl(partner.mou_url, 300)
      ).data?.signedUrl
    : null;

  return (
    <PartnerClient
      partner={partner}
      panUrl={panUrl}
      mouUrl={mouUrl}
    />
  );
}
