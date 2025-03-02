# Cerebro

Intelligent email platform for bulk emails, newsletters, and marketing campaigns.

## Structure

- \`/services\`: Go microservices
- \`/web\`: Next.js web applications
- \`/infra\`: Infrastructure configuration
- \`/api\`: API definitions
- \`/internal\`: Shared Go packages
- \`/docs\`: Documentation

## Development

### Prerequisites

- Go 1.21+
- Node.js 18+
- pnpm 8+
- Docker and Docker Compose

### Setup

\`\`\`bash

### Install dependencies

make setup

### Run development environment

make dev
\`\`\`

### Project Structure

\`\`\`
cerebro/
├── api/               # API definitions
├── docs/              # Documentation
├── infra/             # Infrastructure configuration
├── internal/          # Shared Go code
├── services/          # Go microservices
└── web/               # Next.js applications
    ├── apps/          # Next.js apps
    │   ├── admin/     # Admin dashboard
    │   ├── landing/   # Landing page
    │   └── email-editor/ # Email editor
    └── packages/      # Shared frontend code
        ├── ui/        # UI components
        └── utils/     # Utility functions
\`\`\`
