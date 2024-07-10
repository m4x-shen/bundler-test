This experiment project was created while investigating the issue of [types being `Pick`ed after bundling](https://appier.atlassian.net/browse/DES-1?focusedCommentId=1739595).

## Issue Description

The problem occurs when some components in the `aiqua-design-system` use `Pick` to get all props after bundling. This causes issues when using the components in different projects with newer React versions that have removed some props.

## Project Structure

The same code in [`src/index.tsx`](/src/index.tsx) is bundled with both `tsdx` and `tsup`. The outputs are located in [`tsdx-dist/`](/tsdx-dist/) and [`tsup-dist/`](/tsup-dist/) respectively.

## Components and Testing

Inside [`src/index.tsx`](/src/index.tsx), there are four components to test for the `Pick` issue. The results showed that only the first component exhibited the issue, and using `tsup` resolved it.

## Further Steps

These results were obtained by testing with a new project. We need to apply `tsup` in the `aiqua-design-system` to verify if it solves the issue there as well.
