"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";

interface MdxContentProps {
  code: string;
}

export function MdxContent({ code }: MdxContentProps) {
  const Component = useMDXComponent(code);
  return (
    <div className="prose-blog max-w-none">
      <Component />
    </div>
  );
}
