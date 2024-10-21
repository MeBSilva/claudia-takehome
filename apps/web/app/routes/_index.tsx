import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/Button";
import { ScrollArea } from "~/components/ui/ScrollArea";
import { Textarea } from "~/components/ui/Textarea";
import { features } from "~/services/logicProxy";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const messages = await features.message.list({ conversationId: "1" });
  return json({
    messages,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  await features.message.send({
    conversationId: "1",
    content: formData.get("content") as string,
    userId: 1,
  });

  return { ok: true };
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();

  const formRef = useRef<HTMLFormElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (navigation.state === "idle" && actionData?.ok) {
      formRef.current?.reset();
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [navigation.state, actionData]);

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 md:px-24 py-32 gap-4">
      <header className="flex max-w-5xl w-full justify-between items-center ">
        <div className="flex gap-1">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Chat with <span className="sr-only">Claudia!</span>
          </h1>
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            {" Claudia!"}
          </h1>
        </div>
        <ThemeToggle />
      </header>
      <div className="flex max-w-5xl w-full flex-col border rounded-lg h-full text-sm bg-muted/20 dark:bg-muted/40 p-4">
        <ScrollArea className="w-full h-full">
          <div className="flex flex-col w-full h-full p-4 gap-6">
            {messages.map((message, index) =>
              message.userId === 1 ? (
                <div
                  className="ml-auto max-w-[45%] p-4 bg-primary text-primary-foreground rounded-l-lg rounded-tr-lg  break-words"
                  key={index}
                  ref={index === messages.length - 1 ? scrollRef : undefined}
                >
                  {message.content}
                </div>
              ) : (
                <div
                  className="max-w-[45%] p-4 bg-secondary text-secondary-foreground rounded-r-lg rounded-tl-lg break-words"
                  key={index}
                  ref={index === messages.length - 1 ? scrollRef : undefined}
                >
                  {message.content}
                </div>
              ),
            )}
          </div>
        </ScrollArea>
        <Form
          ref={formRef}
          method="post"
          className="flex flex-col border bg-background focus-within:ring-1 rounded-lg"
        >
          <Textarea
            name="content"
            className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="flex px-4 py-2">
            <Button
              disabled={navigation.state !== "idle"}
              type="submit"
              size="sm"
              className="ml-auto"
            >
              Send
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
