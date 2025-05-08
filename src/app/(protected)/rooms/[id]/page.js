
import { getServerSession } from "next-auth/next";
import MessagesPage from "./massages";
import { authOptions } from "@/app/auth";

export default async function Page({ params }) {
  const { id } =await params;
  const user=(await getServerSession(authOptions)).user
  return (
    <div className="flex flex-col gap-4">
      <MessagesPage roomId={id} user={user} />
    </div>
  );

}