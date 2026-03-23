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

/**
 * Fallback stripping using regex when remark-mdx parser fails
 * (e.g. HTML comments with `!` characters that MDX parser rejects).
 */
function fallbackStrip(markdownBody: string): string {
  return markdownBody
    .split('\n')
    .filter((line) => !line.match(/^\s*import\s+/))
    .filter((line) => !line.match(/^\s*export\s+/))
    .join('\n')
    // Remove JSX self-closing tags like <Component />
    .replace(/<[A-Z][a-zA-Z]*\s*[^>]*\/>/g, '')
    // Remove JSX block elements like <Component ...>...</Component>
    .replace(/<[A-Z][a-zA-Z]*[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '')
    // Remove JSX opening tags without close (flow elements)
    .replace(/<[A-Z][a-zA-Z]*\s[^>]*>/g, '')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove MDX expressions {/* ... */}
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
}

export async function stripMdx(
  content: string,
): Promise<{ frontmatter: Record<string, any>; plainMarkdown: string }> {
  const { data: frontmatter, content: markdownBody } = matter(content);

  let plainMarkdown: string;

  try {
    const result = await unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(removeMdxNodes)
      .use(remarkStringify)
      .process(markdownBody);

    // Remove any surviving plain import lines
    plainMarkdown = String(result)
      .split('\n')
      .filter((line) => !line.match(/^\s*import\s+/))
      .join('\n');
  } catch {
    // Fallback for files with HTML comments or non-standard MDX syntax
    plainMarkdown = fallbackStrip(markdownBody);
  }

  return { frontmatter, plainMarkdown };
}
