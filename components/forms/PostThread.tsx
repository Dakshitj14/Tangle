"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";

interface Props {
  userId: string;
}

function PostThread({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: values.thread,
      author: userId,

      // ✅ IMPORTANT: pass org details properly
      communityId: organization?.id || null,
      communityName: organization?.name || null,
      communityImage: organization?.imageUrl || null,

      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={15}
                  placeholder='What’s on your mind?'
                  {...field}
                  className='no-focus border border-dark-4 bg-dark-3 text-light-1'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ SHOW CURRENT ACCOUNT */}
        {organization && (
          <p className='text-sm text-gray-400'>
            Posting as:{" "}
            <span className='text-primary-500'>
              {organization.name}
            </span>
          </p>
        )}

        <Button type='submit' className='bg-primary-500'>
          Post Tangle
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;