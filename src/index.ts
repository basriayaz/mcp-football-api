import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import http from 'http';
import { z } from 'zod';
import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.FOOTBALL_API_URL || 'http://185.240.104.144';
const API_PREFIX = '/api/v1';

// HTTP client setup
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Tool definitions
const tools: Tool[] = [
  {
    name: 'get_match_details',
    description: 'Get detailed information about a specific match',
    inputSchema: {
      type: 'object',
      properties: {
        match_id: {
          type: 'number',
          description: 'The ID of the match'
        }
      },
      required: ['match_id']
    }
  },
  {
    name: 'analyze_match',
    description: 'Get comprehensive analysis and predictions for a match',
    inputSchema: {
      type: 'object',
      properties: {
        match_id: {
          type: 'number',
          description: 'The ID of the match'
        },
        detailed: {
          type: 'boolean',
          description: 'Include detailed analysis (default: false)'
        }
      },
      required: ['match_id']
    }
  },
  {
    name: 'analyze_match_by_teams',
    description: 'Analyze a match by providing team names',
    inputSchema: {
      type: 'object',
      properties: {
        home_team: {
          type: 'string',
          description: 'Name of the home team'
        },
        away_team: {
          type: 'string',
          description: 'Name of the away team'
        },
        league: {
          type: 'string',
          description: 'Optional league name filter'
        }
      },
      required: ['home_team', 'away_team']
    }
  },
  {
    name: 'get_match_predictions',
    description: 'Get match predictions with recommended bets',
    inputSchema: {
      type: 'object',
      properties: {
        match_id: {
          type: 'number',
          description: 'The ID of the match'
        }
      },
      required: ['match_id']
    }
  },
  {
    name: 'get_odds_analysis',
    description: 'Get comprehensive odds analysis for a match',
    inputSchema: {
      type: 'object',
      properties: {
        match_id: {
          type: 'number',
          description: 'The ID of the match'
        },
        include_predictions: {
          type: 'boolean',
          description: 'Include match predictions with odds analysis'
        }
      },
      required: ['match_id']
    }
  },
  {
    name: 'get_value_bets',
    description: 'Find value betting opportunities for a match',
    inputSchema: {
      type: 'object',
      properties: {
        match_id: {
          type: 'number',
          description: 'The ID of the match'
        },
        min_value: {
          type: 'number',
          description: 'Minimum value percentage (default: 5.0)'
        }
      },
      required: ['match_id']
    }
  },
  {
    name: 'get_arbitrage_opportunities',
    description: 'Find arbitrage betting opportunities for a match',
    inputSchema: {
      type: 'object',
      properties: {
        match_id: {
          type: 'number',
          description: 'The ID of the match'
        }
      },
      required: ['match_id']
    }
  },
  {
    name: 'get_odds_trends',
    description: 'Analyze odds movement trends for a match',
    inputSchema: {
      type: 'object',
      properties: {
        match_id: {
          type: 'number',
          description: 'The ID of the match'
        },
        market: {
          type: 'string',
          description: 'Market to analyze (1x2, over_under, first_half, all)',
          enum: ['1x2', 'over_under', 'first_half', 'all']
        }
      },
      required: ['match_id']
    }
  },
  {
    name: 'get_opening_closing_analysis',
    description: 'Compare opening vs closing odds',
    inputSchema: {
      type: 'object',
      properties: {
        match_id: {
          type: 'number',
          description: 'The ID of the match'
        },
        outcome: {
          type: 'string',
          description: 'Outcome to analyze (home, draw, away, all)',
          enum: ['home', 'draw', 'away', 'all']
        },
        min_change: {
          type: 'number',
          description: 'Minimum change percentage to include'
        }
      },
      required: ['match_id']
    }
  },
  {
    name: 'get_goal_expectation_trends',
    description: 'Analyze goal expectation trends from odds movements',
    inputSchema: {
      type: 'object',
      properties: {
        match_id: {
          type: 'number',
          description: 'The ID of the match'
        }
      },
      required: ['match_id']
    }
  },
  {
    name: 'get_matches_by_date',
    description: 'Get all matches for a specific date',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format (max 30 days from today)'
        }
      },
      required: ['date']
    }
  },
  {
    name: 'get_today_matches',
    description: 'Get all matches for today',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_tomorrow_matches',
    description: 'Get all matches for tomorrow',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_yesterday_matches',
    description: 'Get all matches for yesterday',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'list_leagues',
    description: 'Get list of all available leagues',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_league_matches',
    description: 'Get all matches for a specific league',
    inputSchema: {
      type: 'object',
      properties: {
        league_id: {
          type: 'number',
          description: 'The ID of the league'
        }
      },
      required: ['league_id']
    }
  },
  {
    name: 'search_teams',
    description: 'Search for teams by name',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Team name to search for'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_team_matches',
    description: 'Get all matches for a specific team',
    inputSchema: {
      type: 'object',
      properties: {
        team_name: {
          type: 'string',
          description: 'Name of the team'
        }
      },
      required: ['team_name']
    }
  },
  {
    name: 'get_health',
    description: 'Get basic API health status',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_detailed_health',
    description: 'Get detailed system health status including API, cache, and database',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_comprehensive_analysis',
    description: 'Get comprehensive match analysis (alternative endpoint)',
    inputSchema: {
      type: 'object',
      properties: {
        match_id: {
          type: 'number',
          description: 'The ID of the match'
        }
      },
      required: ['match_id']
    }
  },
  {
    name: 'get_odds_comparison',
    description: 'Compare odds across different bookmakers for a match',
    inputSchema: {
      type: 'object',
      properties: {
        match_id: {
          type: 'number',
          description: 'The ID of the match'
        },
        bookmakers: {
          type: 'array',
          description: 'List of bookmakers to compare (optional)',
          items: {
            type: 'string'
          }
        }
      },
      required: ['match_id']
    }
  },
  {
    name: 'get_ms12_analysis',
    description: 'Get first half and second half (MS1-2) odds analysis',
    inputSchema: {
      type: 'object',
      properties: {
        match_id: {
          type: 'number',
          description: 'The ID of the match'
        }
      },
      required: ['match_id']
    }
  },
  {
    name: 'clear_cache',
    description: 'Clear the API cache',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_cache_status',
    description: 'Get current cache status',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

// Initialize MCP Server
const server = new Server(
  {
    name: 'mcp-football-api',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      sse: {}
    }
  }
);

// Store SSE transports for session management
const sseTransports: Record<string, SSEServerTransport> = {};

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let response;
    
    switch (name) {
      case 'get_match_details':
        response = await apiClient.get(`/match/${args?.match_id}`);
        break;
        
      case 'analyze_match':
        response = await apiClient.get(`/match/${args?.match_id}/analysis`, {
          params: { detailed: args?.detailed }
        });
        break;
        
      case 'analyze_match_by_teams':
        response = await apiClient.post('/analyze/match', {
          home_team: args?.home_team,
          away_team: args?.away_team,
          league: args?.league
        });
        break;
        
      case 'get_match_predictions':
        response = await apiClient.get(`/match/${args?.match_id}/predictions`);
        break;
        
      case 'get_odds_analysis':
        response = await apiClient.get(`/match/${args?.match_id}/odds-analysis`, {
          params: { include_predictions: args?.include_predictions }
        });
        break;
        
      case 'get_value_bets':
        response = await apiClient.get(`/match/${args?.match_id}/value-bets`, {
          params: { min_value: args?.min_value }
        });
        break;
        
      case 'get_arbitrage_opportunities':
        response = await apiClient.get(`/match/${args?.match_id}/arbitrage`);
        break;
        
      case 'get_odds_trends':
        response = await apiClient.get(`/match/${args?.match_id}/odds-trends`, {
          params: { market: args?.market || 'all' }
        });
        break;
        
      case 'get_opening_closing_analysis':
        response = await apiClient.get(`/match/${args?.match_id}/opening-closing-analysis`, {
          params: { 
            outcome: args?.outcome || 'all',
            min_change: args?.min_change
          }
        });
        break;
        
      case 'get_goal_expectation_trends':
        response = await apiClient.get(`/match/${args?.match_id}/goal-expectation-trends`);
        break;
        
      case 'get_matches_by_date':
        response = await apiClient.get(`/matches/date/${args?.date}`);
        break;
        
      case 'get_today_matches':
        response = await apiClient.get('/matches/today');
        break;
        
      case 'get_tomorrow_matches':
        response = await apiClient.get('/matches/tomorrow');
        break;
        
      case 'get_yesterday_matches':
        response = await apiClient.get('/matches/yesterday');
        break;
        
      case 'list_leagues':
        response = await apiClient.get('/leagues');
        break;
        
      case 'get_league_matches':
        response = await apiClient.get(`/leagues/${args?.league_id}/matches`);
        break;
        
      case 'search_teams':
        response = await apiClient.get('/teams/search', {
          params: { q: args?.query }
        });
        break;
        
      case 'get_team_matches':
        response = await apiClient.get(`/teams/${encodeURIComponent(String(args?.team_name || ''))}/matches`);
        break;
        
      case 'get_health':
        response = await apiClient.get('/health');
        break;
        
      case 'get_detailed_health':
        response = await apiClient.get('/health/detailed');
        break;
        
      case 'get_comprehensive_analysis':
        response = await apiClient.get(`/analyze/${args?.match_id}`);
        break;
        
      case 'get_odds_comparison':
        response = await apiClient.get(`/match/${args?.match_id}/odds-comparison`, {
          params: { bookmakers: args?.bookmakers }
        });
        break;
        
      case 'get_ms12_analysis':
        response = await apiClient.get(`/match/${args?.match_id}/ms12-analysis`);
        break;
        
      case 'clear_cache':
        response = await apiClient.post('/cache/clear');
        break;
        
      case 'get_cache_status':
        response = await apiClient.get('/cache/status');
        break;
        
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }
      ]
    };
    
  } catch (error: any) {
    console.error(`Error executing tool ${name}:`, error);
    
    // Handle API errors
    if (error.response) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: true,
              status: error.response.status,
              message: error.response.data?.error || error.response.statusText,
              data: error.response.data
            }, null, 2)
          }
        ],
        isError: true
      };
    }
    
    // Handle other errors
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: true,
            message: error.message || 'An unexpected error occurred'
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

// HTTP Server port configuration
// Railway uses PORT environment variable
const HTTP_PORT = parseInt(process.env.PORT || process.env.HTTP_PORT || '3000');
const HTTP_HOST = process.env.HOST || '0.0.0.0'; // Railway requires 0.0.0.0
const USE_HTTP = process.env.USE_HTTP === 'true' || !!process.env.PORT; // Auto-enable HTTP for Railway

// HTTP Server for SSE support
let httpServer: http.Server | null = null;

if (USE_HTTP) {
  httpServer = http.createServer(async (req, res) => {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Health check endpoint
    if (req.url === '/health' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        server: 'mcp-football-api',
        version: '1.0.0',
        sse: true,
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // MCP SSE endpoint
    if (req.url === '/sse' && req.method === 'GET') {
      try {
        const transport = new SSEServerTransport('/messages', res);
        sseTransports[transport.sessionId] = transport;

        res.on('close', () => {
          delete sseTransports[transport.sessionId];
          console.error(`SSE connection closed for session ${transport.sessionId}`);
        });

        await server.connect(transport);
        console.error(`SSE connection established with session ${transport.sessionId}`);
      } catch (error) {
        console.error('SSE connection error:', error);
        res.writeHead(500);
        res.end('SSE connection failed');
      }
      return;
    }

    // MCP Messages endpoint for SSE
    if (req.url?.startsWith('/messages') && req.method === 'POST') {
      try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const sessionId = url.searchParams.get('sessionId');

        if (!sessionId || !sseTransports[sessionId]) {
          res.writeHead(404);
          res.end('Session not found');
          return;
        }

        const transport = sseTransports[sessionId];
        await transport.handlePostMessage(req, res);
      } catch (error) {
        console.error('Message handling error:', error);
        res.writeHead(500);
        res.end('Message handling failed');
      }
      return;
    }

    // 404 for other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  httpServer.listen(HTTP_PORT, HTTP_HOST, () => {
    console.error(`HTTP Server with SSE support started on ${HTTP_HOST}:${HTTP_PORT}`);
    console.error(`SSE endpoint available at: http://${HTTP_HOST}:${HTTP_PORT}/sse`);
    console.error(`Health check available at: http://${HTTP_HOST}:${HTTP_PORT}/health`);
  });
}

// Start the server
async function main() {
  if (USE_HTTP) {
    // HTTP mode with SSE support (Railway compatible)
    console.error('MCP Football API Server started in HTTP mode with SSE support');
    console.error(`Server running on ${HTTP_HOST}:${HTTP_PORT}`);
    console.error(`Environment: ${process.env.NODE_ENV || 'development'}`);
  } else {
    // Default Stdio mode (backward compatibility)
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('MCP Football API Server started in Stdio mode');
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});