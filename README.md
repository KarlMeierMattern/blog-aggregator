# Blog Aggregator

A CLI tool for aggregating blog feeds, built with TypeScript and Node.js.

## Prerequisites

- Node.js
- PostgreSQL database

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a config file at `~/.gatorconfig.json`:
   ```json
   {
     "db_url": "postgres://username:password@localhost:5432/dbname",
     "current_user_name": ""
   }
   ```

## Usage

Run commands with:

```
npm start -- <command> [args]
```

### Commands

| Command | Args         | Description          |
| ------- | ------------ | -------------------- |
| `login` | `<username>` | Set the current user |

### Example

```
npm start -- login alice
```
