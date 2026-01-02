import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const solc = require('solc');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const contractSources = {
  'ChronoToken.sol': fs.readFileSync(path.join(projectRoot, 'contracts', 'ChronoToken.sol'), 'utf8'),
  'MockUSDC.sol': fs.readFileSync(path.join(projectRoot, 'contracts', 'MockUSDC.sol'), 'utf8'),
  'ChronoPresale.sol': fs.readFileSync(path.join(projectRoot, 'contracts', 'ChronoPresale.sol'), 'utf8'),
  'ChronoAirdrop.sol': fs.readFileSync(path.join(projectRoot, 'contracts', 'ChronoAirdrop.sol'), 'utf8'),
};

function findImports(importPath) {
  try {
    // Attempt to handle @openzeppelin imports
    let nodeModulesPath;
    if (importPath.startsWith('@openzeppelin')) {
       nodeModulesPath = path.join(projectRoot, 'node_modules', importPath);
    } else {
       nodeModulesPath = path.join(projectRoot, 'node_modules', importPath);
    }

    if (fs.existsSync(nodeModulesPath)) {
      return { contents: fs.readFileSync(nodeModulesPath, 'utf8') };
    }
  } catch (e) {
    return { error: 'File not found' };
  }
  return { error: 'File not found ' + importPath };
}

const input = {
  language: 'Solidity',
  sources: {
    'ChronoToken.sol': { content: contractSources['ChronoToken.sol'] },
    'MockUSDC.sol': { content: contractSources['MockUSDC.sol'] },
    'ChronoPresale.sol': { content: contractSources['ChronoPresale.sol'] },
    'ChronoAirdrop.sol': { content: contractSources['ChronoAirdrop.sol'] }
  },
  settings: {
    evmVersion: 'paris',
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode']
      }
    }
  }
};

console.log("Compiling contracts with solc...");
const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

let hasErrors = false;
if (output.errors) {
  output.errors.forEach(err => {
    // Filter out warnings
    if (err.severity === 'error') {
        console.error("ERROR:", err.formattedMessage);
        hasErrors = true;
    } else {
        console.log("WARN:", err.formattedMessage);
    }
  });
}

if (hasErrors) {
    console.error("Compilation failed due to errors.");
    process.exit(1);
}

const artifactsDir = path.join(projectRoot, 'artifacts_manual');
if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir);

// Save artifacts
for (const fileName in output.contracts) {
  for (const contractName in output.contracts[fileName]) {
     const artifact = output.contracts[fileName][contractName];
     fs.writeFileSync(
       path.join(artifactsDir, `${contractName}.json`),
       JSON.stringify(artifact, null, 2)
     );
     console.log(`Saved artifact: ${contractName}`);
  }
}
console.log("Compilation complete.");
