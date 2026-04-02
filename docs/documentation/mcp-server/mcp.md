---
title: 1NCE MCP
sidebar_position: 1
draft: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The 1NCE Developer Hub Model Context Protocol (MCP) server enables AI-powered code editors like Cursor and Windsurf, plus general-purpose tools like Claude Desktop, to interact directly with your 1NCE Developer Hub API and documentation.

## What is MCP?

Model Context Protocol (MCP) is an open standard that allows AI applications to securely access external data sources and tools. The 1NCE Developer Hub MCP server provides AI agents with:

* **Direct API access** to 1NCE Developer Hub functionality
* **Documentation search** capabilities
* **Real-time data** from your 1NCE Developer Hub account
* **Code generation** assistance for 1NCE Developer Hub integrations

## 1NCE Developer Hub MCP Server Setup

1NCE Developer Hub hosts a remote MCP server at `https://help.1nce.com/mcp`. Configure your AI development tools to connect to this server. If your APIs require authentication, you can pass in headers via query parameters or however headers are configured in your MCP client.

<Tabs>
  <TabItem value="cursor" label="Cursor">
    **Add to `~/.cursor/mcp.json`:**

    ```json
    {
      "mcpServers": {
        "dev-hub": {
          "url": "https://help.1nce.com/mcp"
        }
      }
    }
    ```

    </TabItem>
  <TabItem value="windsurf" label="Windsurf">
    **Add to `~/.codeium/windsurf/mcp_config.json`:**

    ```json
    {
      "mcpServers": {
        "dev-hub": {
          "url": "https://help.1nce.com/mcp"
        }
      }
    }
    ```

  </TabItem>
  <TabItem value="claude-desktop" label="Claude Desktop">
    **Add to `claude_desktop_config.json`:**

    ```json
    {
      "mcpServers": {
        "dev-hub": {
          "url": "https://help.1nce.com/mcp"
        }
      }
    }
    ```

  </TabItem>
</Tabs>

## Testing Your MCP Setup

Once configured, you can test your MCP server connection:

1. **Open your AI editor** (Cursor, Windsurf, etc.)
2. **Start a new chat** with the AI assistant
3. **Ask about 1NCE Developer Hub** - try questions like:
   * "How do I [common use case]?"
   * "Show me an example of [API functionality]"
   * "Create a [integration type] using 1NCE Developer Hub"

The AI should now have access to your 1NCE Developer Hub account data and documentation through the MCP server.
