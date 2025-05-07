import BirthdayPage from "@/components/birthdays";
export default async function Page({
  params,
}: {
  params: Promise<{ address: string }>
}) {
  const { address } = await params
  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10 overflow-hidden">
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center flex flex-col items-center justify-start">
        <BirthdayPage address={address} />
      </div>
    </div>
  );
}