import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { profileTabs } from "@/constants";

import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchUser } from "@/lib/actions/user.actions";

export const revalidate = 0; // ✅ IMPORTANT

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  // ✅ FIX: convert to plain object
  const cleanUser = {
    id: userInfo.id,
    name: userInfo.name,
    username: userInfo.username,
    image: userInfo.image,
    bio: userInfo.bio,
    threads: userInfo.threads || [],
  };

  return (
    <section>
      <ProfileHeader
        accountId={cleanUser.id}
        authUserId={user.id}
        name={cleanUser.name}
        username={cleanUser.username}
        imgUrl={cleanUser.image}
        bio={cleanUser.bio}
      />

      <div className='mt-9'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                />
                <p>{tab.label}</p>
              </TabsTrigger>
            ))}
          </TabsList>

          {profileTabs.map((tab) => (
            <TabsContent key={tab.label} value={tab.value}>
              <ThreadsTab
                currentUserId={user.id}
                accountId={cleanUser.id}
                accountType='User'
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default Page;