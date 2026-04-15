type SubjectRichContentProps = {
  html: string;
};

export function SubjectRichContent({ html }: SubjectRichContentProps) {
  return (
    <div
      className="text-base leading-relaxed text-slate-700 break-words [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p:first-child]:mt-0 [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h1:first-child]:mt-0 [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2:first-child]:mt-0 [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3:first-child]:mt-0 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul:first-child]:mt-0 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol:first-child]:mt-0 [&_li]:my-1 [&_a]:text-primary [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_blockquote:first-child]:mt-0 [&_pre]:my-4 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-slate-100 [&_pre]:p-3 [&_pre:first-child]:mt-0 [&_img]:my-4 [&_img]:h-auto [&_img]:max-h-[min(70vh,30rem)] [&_img]:w-full [&_img]:max-w-full [&_img]:rounded-xl [&_img]:object-contain [&_img:first-child]:mt-0 [&_table]:my-4 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table:first-child]:mt-0 [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
