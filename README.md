# @tokdaniel/tokenlist

A comprehensive TypeScript library for managing token lists with built-in validation and utilities. Built on top of the Uniswap token list standard.

## Features

- 🔍 Token lookup by chain ID, address, or symbol
- ✨ Type-safe token validation using Zod schemas
- 🔒 Type-safe utilities with full TypeScript support
- 📝 Comprehensive token list management tools

## Installation

```bash
npx create-tokenlist project-name
```

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

## Prerequisites

- Node.js >= 18
- npm >= 9

## Token List Format

Tokens follow the [Uniswap Token List](https://github.com/Uniswap/token-lists) standard:

```typescript
interface TokenInfo {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
  extensions?: Record<string, any>;
}
```

### Validation Rules

- `chainId`: Must be a positive integer
- `address`: Must be a valid Ethereum address (0x-prefixed, 40 hex characters)
- `name`: 1-60 characters, must contain non-whitespace characters
- `symbol`: 1-20 characters, no whitespace
- `decimals`: Integer between 0 and 255
- `logoURI`: Optional, must be a valid URL if provided
- `tags`: Optional, maximum 10 tags

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