export function projectCover(category: string) {
  if (/shop|commerce/i.test(category)) return "/projects/commerce.svg";
  if (/ai/i.test(category)) return "/projects/ai-workflows.svg";
  return "/projects/web-product.svg";
}
