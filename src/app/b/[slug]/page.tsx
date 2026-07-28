import ClientPage from "./ClientPage";

export async function generateStaticParams() {
  return [
    { slug: "subaru-wrx-sti-stage3" },
    { slug: "golf-gti-mk75-repro" },
    { slug: "nissan-silvia-s15-spec-r" },
  ];
}

export default function Page() {
  return <ClientPage />;
}
