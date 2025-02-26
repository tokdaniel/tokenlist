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

## Next Steps

After running the npx command to create your tokenlist project, you'll need to customize it to fit your specific requirements:

1. **Change the project name**: Update the `name` field in the `package.json` file to reflect your project's name.

2. **Customize the token list**: Modify the token list in your project to include the tokens relevant to your use case.

3. **Set up npm publishing**: To publish your bundled version on npm:
   - Ensure you have an npm account and are logged in (`npm login`).
   - Update the `version` field in `package.json` when making changes.
   - Run `npm publish` to publish your package.
   - Or create a repository, and set up a github action 

4. **Configure CI/CD (optional)**: Set up a CI/CD pipeline to automate the build, test, and publish process (e.g [semantic-release](https://github.com/semantic-release/semantic-release))

Remember to thoroughly test your customized tokenlist before publishing to ensure it meets your specific needs and maintains the integrity of the original library.

## CLI Usage

The package includes a powerful CLI tool for managing your token list. You can use it to add/remove tokens and manage tags interactively.

### Starting the CLI

```bash
npm run cli
```

### Available Commands

The CLI provides the following options:

1. **Add a token**
   - Interactively add a new token to the list
   - Required fields:
     - Chain ID (1-255)
     - Token address (0x-prefixed Ethereum address)
     - Token name
     - Token symbol
     - Decimals (0-18)
   - Optional fields:
     - Logo URI
     - Tags (select from existing tags using checkbox interface)

2. **Remove a token**
   - Search for tokens by symbol
   - Select the specific token to remove from search results
   - Automatically updates all references

3. **Add a tag**
   - Create a new tag with:
     - Tag identifier (1-10 alphanumeric characters and underscores)
     - Tag name (1-20 characters)
     - Tag description (1-200 characters)
   - Validates input according to schema rules
   - Prevents duplicate tag identifiers

4. **Remove tags**
   - Multi-select interface to choose tags to remove
   - Automatically removes selected tags from:
     - The main tags registry
     - Any tokens that were using those tags
   - Provides feedback on the operation

### Example Usage

```bash
# Start the CLI
npm run cli

# Choose "Add a token" and follow the prompts:
> Enter chain ID: 1
> Enter token address: 0x...
> Enter token name: My Token
> Enter token symbol: MTK
> Enter decimals: 18
> Enter logo URI (optional): https://...
> Select tags (if any exist): [x] stablecoin [ ] defi

# Choose "Add a tag" and follow the prompts:
> Enter tag identifier: defi
> Enter tag name: DeFi Token
> Enter tag description: Tokens used in decentralized finance applications
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