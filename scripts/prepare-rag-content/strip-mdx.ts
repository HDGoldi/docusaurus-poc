import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import matter from 'gray-matter';

function removeMdxNodes() {
  return (tree: any) => {
    // Remove import/export declarations and flow-level JSX elements
    tree.children = tree.children.filter(
      (node: any) =>
        !['mdxjsEsm', 'mdxJsxFlowElement', 'mdxJsxTextElement', 'mdxFlowExpression'].includes(
          node.type,
        ),
    );
    // Remove inline JSX elements within paragraphs
    visit(tree, (node: any, index, parent) => {
      if (node.type === 'mdxJsxTextElement' && parent && index !== undefined) {
        parent.children.splice(index, 1);
        return index; // revisit this index
      }
    });
  };
}

export async function stripMdx(
  content: string,
): Promise<{ frontmatter: Record<string, any>; plainMarkdown: string }> {
  const { data: frontmatter, content: markdownBody } = matter(content);

  const result = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(removeMdxNodes)
    .use(remarkStringify)
    .process(markdownBody);

  // Remove any surviving plain import lines
  let plainMarkdown = String(result)
    .split('\n')
    .filter((line) => !line.match(/^\s*import\s+/))
    .join('\n');

  return { frontmatter, plainMarkdown };
}
