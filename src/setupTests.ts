import { expect } from 'vitest'
import matchers from '@testing-library/jest-dom/matchers'

// Register jest-dom matchers with Vitest's expect so tests can use toBeInTheDocument, toBeVisible, etc.
expect.extend(matchers)

// Any other global test setup can go here (e.g., mocking fetch or configuring test globals)
