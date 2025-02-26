# @tokdaniel/tokenlist

A comprehensive TypeScript library for managing token lists with built-in validation, utilities, and CLI tools. Built on top of the Uniswap token list standard.

## Features

- 🔍 Token lookup by chain ID, address, or symbol
- ✨ Type-safe token validation using Zod schemas
- 🛠️ CLI tools for project setup and token management
- 📦 Easy project bootstrapping with `npx tokenlist create`
- 🎯 Interactive token addition wizard
- 🔒 Type-safe utilities with full TypeScript support

## Installation

```bash
npm install @tokdaniel/tokenlist
```

## CLI Usage

### Creating a New Project

```bash
npx tokenlist create my-tokenlist
cd my-tokenlist
npm install
```

### Adding New Tokens

From within your project directory:

```bash
npm run token:add
```

This will start an interactive wizard that guides you through adding a new token to your list.

## API Reference

### Token Validation

```typescript
import { isToken, isListedToken } from '@tokdaniel/tokenlist';

// Validate if an object matches the TokenInfo interface
isToken(tokenObject);

// Check if a token is listed in the tokenlist
isListedToken(tokenObject);
```

### Token Lookup

```typescript
import {
  getTokenByChainAndAddress,
  getTokenByChainAndSymbol,
  getChainTokenList
} from '@tokdaniel/tokenlist';

// Get token by chain ID and address
const token = getTokenByChainAndAddress(1, '0x...');

// Get token by chain ID and symbol
const usdcToken = getTokenByChainAndSymbol(1, 'USDC');

// Get all tokens for a specific chain
const ethereumTokens = getChainTokenList(1);

// Get tokens with specific tags
const currencyTokens = getChainTokenList(1, ['currency']);
```

### Curried Variants

For functional programming enthusiasts, curried versions of the lookup functions are available:

```typescript
import {
  getTokenByChainAndAddressCurried,
  getTokenByChainAndSymbolCurried
} from '@tokdaniel/tokenlist';

const getEthereumToken = getTokenByChainAndAddressCurried(1);
const token = getEthereumToken('0x...');

const getEthereumTokenBySymbol = getTokenByChainAndSymbolCurried(1);
const usdcToken = getEthereumTokenBySymbol('USDC');
```

### Address Utilities

```typescript
import { isAddressEqual, isTokenEqual } from '@tokdaniel/tokenlist';

// Compare Ethereum addresses case-insensitively
isAddressEqual(address1, address2);

// Compare tokens based on chainId and address
isTokenEqual(tokenA, tokenB);
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/tokdaniel/tokenlist.git
cd tokenlist

# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

### Available Scripts

- `npm run lint` - Run linter checks
- `npm run format` - Format code using Biome
- `npm run test` - Run test suite
- `npm run coverage` - Generate test coverage report
- `npm run list:validate` - Validate token list
- `npm run list:build` - Build token list
- `npm run list:bundle` - Bundle package for distribution
- `npm run build:cli` - Build CLI tools

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.