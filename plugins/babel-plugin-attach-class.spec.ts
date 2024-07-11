import { test as base, expect } from '@playwright/test';
import { transform } from '@babel/core';
import type { BabelFileResult } from '@babel/core';

const test = base.extend<{
  babelTransform: (code: string) => Promise<BabelFileResult | null>;
}>({
  babelTransform: async ({}, use, testInfo) => {
    await use(async (code: string) => {
      const result = transform(code, {
        plugins: [
          '@babel/plugin-syntax-jsx',
          ['./plugins/babel-plugin-attach-class', { className: 'appier-ds' }],
        ],
        babelrc: false,
        configFile: false,
      });
      testInfo.snapshotSuffix = '';

      await expect(result?.code).toMatchSnapshot();

      return result;
    });
  },
});

test('JSX Element', async ({ babelTransform }) => {
  await babelTransform(`<div className="test">
  <h1 />
  <h2 className={\`flex\`} />
  <h3 className={cx('flex', true && 'text-red-40')} />
  <h3 className={twMerge(['flex', false && ['text-red-40']])} />
  <h4 className={\`
  a b c
  d e f
  \`} />
  <styled.div className="a" />
  <StyledDiv className="a" />
</div>`);
});

test('extend props', async ({ babelTransform }) => {
  await babelTransform(`
    <div {...props} />
  `);
});

test('createElement with React', async ({ babelTransform }) => {
  await babelTransform(`import React from 'react';

React.createElement('div', { className: 'test' }, null)

React.createElement("div", Object.assign({}, getFloatingProps({
    ref: mergedPopoverRef,
    style: {
      position: strategy,
      top: y != null ? y : '',
      left: x != null ? x : '',
      zIndex: 1000
    }
  }), {
    className: cx('text-content-high', className)
  }, props), children)
`);
});

test('createElement with extend props', async ({ babelTransform }) => {
  await babelTransform(`import React from 'react';

React.createElement('div', { foo: 'bar', ...props }, null)`);

  await babelTransform(`import React from 'react';

React.createElement('div', { foo: 'bar', ...props, className: twMerge('a b', props.className) }, null)`);
});

test('createElement with Object.assign extend props', async ({
  babelTransform,
}) => {
  await babelTransform(`import React from 'react';

React.createElement('div', Object.assign(
  { foo: 'bar', ...props, className: twMerge('a b', props.className) }
), null)`);

  await babelTransform(`import React from 'react';

React.createElement('div', Object.assign(
  { foo: 'bar' }, props
), null)`);
});

test('createElement without React', async ({ babelTransform }) => {
  await babelTransform(`import { createElement } from 'react';

createElement('div', { className: 'test' }, null)`);
});

test('should not process createElement with Component', async ({
  babelTransform,
}) => {
  await babelTransform(`import { createElement, Fragment } from 'react';

createElement(Fragment, { key: 'key' },
  createElement(Button, { className: 'button' }, null)
)`);
});

test('createElement with React is renamed', async ({ babelTransform }) => {
  await babelTransform(`import react_default from 'react';

react_default.createElement('div', { className: 'test' }, null)`);
});

test('createElement with alias imported', async ({ babelTransform }) => {
  await babelTransform(`import { createElement as ce } from 'react';

ce('div', { className: 'test' },
  [
    ce('h1', null, 'foo'),
    ce('h2', { key: '' }, 'bar'),
  ]
)`);
});

test('JSX + createElement', async ({ babelTransform }) => {
  await babelTransform(`import React, { createElement } from 'react';
import { twMerge } from 'tailwind-merge';

function App({ children }) {
  return (
    <div>
      {children}

      <main>
        {createElement('h1', { className: twMerge('test', ['a', 'b', 'c', \`
        foo
        bar
        \`], 'd') })}
      </main>
    </div>
  )
}

  `);
});
