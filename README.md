# MCP Football API Server

MCP (Model Context Protocol) server that provides football match analysis, odds analysis, and predictions through integration with the Football API.

## Features

- Match details and analysis
- Odds analysis and value betting opportunities
- Team and league information
- Date-based match queries
- Cache management
- **Server-Sent Events (SSE) streaming support**
- **HTTP REST API endpoints**
- Dual transport support (Stdio + HTTP)

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

### For Cursor IDE

Add to your Cursor settings (`.cursorrules` or `settings.json`):

```json
{
  "mcpServers": {
    "football-api": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-football-api/dist/index.js"],
      "env": {
        "FOOTBALL_API_URL": "http://185.240.104.144"
      }
    }
  }
}
```

### For Claude Desktop

On macOS, add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "football-api": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-football-api/dist/index.js"],
      "env": {
        "FOOTBALL_API_URL": "http://185.240.104.144"
      }
    }
  }
}
```

On Windows, add to `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "football-api": {
      "command": "node",
      "args": ["C:\\path\\to\\mcp-football-api\\dist\\index.js"],
      "env": {
        "FOOTBALL_API_URL": "http://185.240.104.144"
      }
    }
  }
}
```

## Available Tools (26 Total)

### Health & System (4 tools)
- `get_health` - Get basic API health status
- `get_detailed_health` - Get detailed system health status including API, cache, and database
- `clear_cache` - Clear the API cache
- `get_cache_status` - Get current cache status

### Match Analysis (5 tools)
- `get_match_details` - Get detailed information about a specific match
- `analyze_match` - Get comprehensive analysis and predictions for a match
- `analyze_match_by_teams` - Analyze a match by providing team names
- `get_match_predictions` - Get match predictions with recommended bets
- `get_comprehensive_analysis` - Get comprehensive match analysis (alternative endpoint)

### Odds Analysis (8 tools)
- `get_odds_analysis` - Get comprehensive odds analysis for a match
- `get_value_bets` - Find value betting opportunities
- `get_arbitrage_opportunities` - Find arbitrage betting opportunities
- `get_odds_trends` - Analyze odds movement trends
- `get_opening_closing_analysis` - Compare opening vs closing odds
- `get_goal_expectation_trends` - Analyze goal expectation trends
- `get_odds_comparison` - Compare odds across different bookmakers for a match
- `get_ms12_analysis` - Get first half and second half (MS1-2) odds analysis

### Date-based Queries (4 tools)
- `get_matches_by_date` - Get all matches for a specific date
- `get_today_matches` - Get all matches for today
- `get_tomorrow_matches` - Get all matches for tomorrow
- `get_yesterday_matches` - Get all matches for yesterday

### League & Team (4 tools)
- `list_leagues` - Get list of all available leagues
- `get_league_matches` - Get all matches for a specific league
- `search_teams` - Search for teams by name
- `get_team_matches` - Get all matches for a specific team

## Usage Examples

In Cursor IDE or Claude Desktop, you can use natural language:

```
"Get details for match ID 123456"
"Analyze the match between Real Madrid and Barcelona"
"Show me value betting opportunities for match 123456"
"List all matches in league 36"
"Search for teams with 'Manchester' in their name"
```

## HTTP Server with SSE Support

The server supports both traditional Stdio transport and HTTP with Server-Sent Events (SSE) streaming.

### Starting HTTP Server

```bash
# Development mode with HTTP/SSE support
npm run dev:http

# Production mode with HTTP/SSE support
npm run start:http
```

### Environment Variables

- `USE_HTTP=true` - Enable HTTP server mode
- `HTTP_PORT=3000` - HTTP server port (default: 3000)
- `FOOTBALL_API_URL` - Base URL for the Football API (default: http://185.240.104.144)

### HTTP Endpoints

- `GET /health` - Server health check
- `GET /sse` - MCP Server-Sent Events endpoint for streaming
- `POST /messages?sessionId=<id>` - MCP message endpoint for SSE sessions

### Example HTTP Usage

```javascript
// Health check
fetch('http://localhost:3000/health')
  .then(res => res.json())
  .then(data => console.log(data));

// SSE streaming connection
const eventSource = new EventSource('http://localhost:3000/sse');
eventSource.onmessage = (event) => {
  console.log('Received MCP message:', event.data);
};
```

## Development

```bash
# Run in development mode (Stdio)
npm run dev

# Run in development mode (HTTP/SSE)
npm run dev:http

# Build for production
npm run build

# Start production server (Stdio)
npm start

# Start production server (HTTP/SSE)
npm run start:http
```



## License

MIT