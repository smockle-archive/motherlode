// Symbols, current prices, current number of shares, ideal allocation in memory
  // TODO: Look up current prices
  // TODO: Ask for symbols, current number of shares, ideal allocation (or read from file)

// Calculate current allocation

// Calculate difference between current allocation and ideal allocation for each symbol

// Ask how many more dollars we want to allocate
  // TODO: Support deallocating [i.e. withdrawing] dollars
  // TODO: Support changing ideal allocation with existing number of dollars

// While dollars we want to allocate is greater than dollars we’ve allocated
  // Remove as many dollars we want to allocate as it takes to purchase one share of the symbol with the greatest [negative] difference

// Display current number of shares, recommended purchases of shares, and what the number of shares after purchase would be
  // TODO: Save symbols, [new] current number of shares, ideal allocation to file

export default function() {};
