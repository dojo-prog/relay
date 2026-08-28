import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface TooltipWrapperProps {
  children: React.ReactElement;
  content: React.ReactNode;
  contentClassName?: string;
}

const TooltipWrapper = ({
  children,
  content,
  contentClassName,
}: TooltipWrapperProps) => {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />

      <TooltipContent className={contentClassName}>{content}</TooltipContent>
    </Tooltip>
  );
};

export default TooltipWrapper;
