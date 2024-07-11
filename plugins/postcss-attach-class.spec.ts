import { test as base, expect } from '@playwright/test';
import postcss from 'postcss';
import attachClassPlugin from './postcss-attach-class';

const test = base.extend<{
  postcssTransform: (code: string) => Promise<postcss.Result>;
}>({
  postcssTransform: async ({}, use, testInfo) => {
    testInfo.snapshotSuffix = '';
    await use(async (code: string) => {
      const result = await postcss([
        attachClassPlugin({ className: 'appier-ds' }),
      ]).process(code, { from: undefined });

      await expect(result.css).toMatchSnapshot();

      return result;
    });
  },
});

test('should attach class to the selector', async ({ postcssTransform }) => {
  await postcssTransform(`.flex { display: flex; }`);
});

test('should not attach class to the selectors', async ({
  postcssTransform,
}) => {
  await postcssTransform(
    [`.a, .b { display: flex; }`, `a::before { display: flex; }`].join('\n')
  );
});

test('should attach class to the selector with pseudo selector', async ({
  postcssTransform,
}) => {
  await postcssTransform(
    [`.a:hover { display: flex; }`, `.hover\\:flex { display: flex; }`].join(
      '\n'
    )
  );
});

test('should attach class to the selector with pseudo element', async ({
  postcssTransform,
}) => {
  await postcssTransform(
    [`.a::before { display: flex; }`, `.before\\:flex { display: flex; }`].join(
      '\n'
    )
  );
});
