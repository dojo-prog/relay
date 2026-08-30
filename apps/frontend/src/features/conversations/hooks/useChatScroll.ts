import type { InfiniteData } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useRef } from "react";

type UseChatScrollProps = {
  conversationId: string;
  messagesData: InfiniteData<any>;
  hasNextMessages: boolean;
  fetchNextMessages: () => Promise<unknown>;
  isFetchingNextMessages: boolean;
};

export const useChatScroll = ({
  conversationId,
  messagesData,
  hasNextMessages,
  fetchNextMessages,
  isFetchingNextMessages,
}: UseChatScrollProps) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLElement>(null);

  const initialScrollConversationRef = useRef<string | null>(null);

  const previousScrollHeightRef = useRef<number | null>(null);
  const previousScrollTopRef = useRef<number | null>(null);

  useEffect(() => {
    const element = observerRef.current;
    const container = messagesContainerRef.current;

    if (!element || !container || !hasNextMessages) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting) return;
        if (isFetchingNextMessages) return;

        previousScrollHeightRef.current = container.scrollHeight;
        previousScrollTopRef.current = container.scrollTop;

        await fetchNextMessages();
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchNextMessages, hasNextMessages, isFetchingNextMessages]);

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;

    const previousScrollHeight = previousScrollHeightRef.current;
    const previousScrollTop = previousScrollTopRef.current;

    if (
      !container ||
      previousScrollHeight === null ||
      previousScrollTop === null
    ) {
      return;
    }

    const heightDifference = container.scrollHeight - previousScrollHeight;

    container.scrollTop = previousScrollTop + heightDifference;

    previousScrollHeightRef.current = null;
    previousScrollTopRef.current = null;
  }, [messagesData]);

  useLayoutEffect(() => {
    if (!conversationId || !messagesData) return;

    if (initialScrollConversationRef.current === conversationId) {
      return;
    }

    initialScrollConversationRef.current = conversationId;

    bottomRef.current?.scrollIntoView({
      behavior: "instant",
    });
  }, [conversationId, messagesData]);

  useEffect(() => {
    if (
      initialScrollConversationRef.current &&
      initialScrollConversationRef.current !== conversationId
    ) {
      initialScrollConversationRef.current = null;
    }
  }, [conversationId]);

  return {
    messagesContainerRef,
    observerRef,
    bottomRef,
  };
};
