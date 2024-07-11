/**
 * @deprecated This is a workaround to add a className to all JSX elements, maybe is unstable.
 * @param {*} babel
 * @param {*} param1
 * @returns
 */

module.exports = function(babel, { className = '' }) {
  console.log('babel plugin!');

  const { types: t } = babel;
  let fragmentAlias = 'Fragment';
  let createElementAlias = 'createElement';

  const optionalClassNameOfProps = (propsName = 'props') =>
    //  => className + (propsName.className ?? '')
    t.binaryExpression(
      '+',
      t.stringLiteral(`${className} `),
      t.logicalExpression(
        '??',
        t.optionalMemberExpression(
          propsName,
          t.identifier('className'),
          false,
          true
        ),
        t.stringLiteral('')
      )
    );

  /**
   * TODO: check jsx
   */
  let jsxAlias = 'jsx';
  let jsxDevAlias = 'jsxDEV';

  return {
    name: 'attach-class',
    visitor: className
      ? {
          VariableDeclaration(path) {
            for (const d of path.node.declarations) {
              if (d.init?.name === 'createElement') {
                createElementAlias = d.id.name;

                break;
              }
            }
          },
          ImportDeclaration(path) {
            if (path.node.source.value === 'react') {
              for (const s of path.node.specifiers) {
                if (s.imported?.name === 'Fragment') {
                  if (s.local.name !== s.imported.name) {
                    fragmentAlias = s.local.name;
                  }
                }

                if (s.imported?.name === 'createElement') {
                  if (s.local.name !== s.imported.name) {
                    createElementAlias = s.local.name;
                  }
                }
              }
            }

            if (path.node.source.value === 'react/jsx-runtime') {
              for (const s of path.node.specifiers) {
                if (s.imported?.name === 'jsx') {
                  if (s.local.name !== s.imported.name) {
                    jsxAlias = s.local.name;

                    break;
                  }
                }
              }
            }

            if (path.node.source.value === 'react/jsx-dev-runtime') {
              for (const s of path.node.specifiers) {
                if (s.imported?.name === 'jsxDEV') {
                  if (s.local.name !== s.imported.name) {
                    jsxDevAlias = s.local.name;

                    break;
                  }
                }
              }
            }
          },
          CallExpression(path) {
            if (
              ![createElementAlias].includes(
                path.node.callee.name ?? path.node.callee.property?.name
              ) ||
              path.node.arguments.length < 2
            )
              return;

            const [htmlTagOrComponent] = path.node.arguments;

            // If it's a Fragment, don't need to add a className
            if (
              (t.isIdentifier(htmlTagOrComponent) &&
                htmlTagOrComponent.name === fragmentAlias) ||
              (t.isMemberExpression(htmlTagOrComponent) &&
                htmlTagOrComponent.object.name === 'React' &&
                htmlTagOrComponent.property.name === 'Fragment')
            )
              return;

            if (t.isNullLiteral(path.node.arguments[1])) {
              path.node.arguments[1] = t.objectExpression([]);
            }

            const props = path.node.arguments[1];

            if (t.isCallExpression(props)) {
              // is Object.assign
              if (
                props.callee.object.name === 'Object' &&
                props.callee.property.name === 'assign'
              ) {
                let classNameProp = null;
                for (const arg of props.arguments) {
                  if (t.isObjectExpression(arg)) {
                    for (const prop of arg.properties) {
                      if (t.isIdentifier(prop.key, { name: 'className' })) {
                        classNameProp = prop;

                        break;
                      }
                    }
                  }

                  if (classNameProp) break;
                }

                if (classNameProp) {
                  classNameProp.value = t.binaryExpression(
                    '+',
                    t.stringLiteral(`${className} `),
                    classNameProp.value
                  );
                } else {
                  const findProps = props.arguments.find(arg =>
                    t.isIdentifier(arg)
                  );

                  if (findProps) {
                    const propsName = findProps.name;

                    props.arguments.push(
                      t.objectExpression([
                        t.objectProperty(
                          t.identifier('className'),
                          optionalClassNameOfProps(t.identifier(propsName))
                        )
                      ])
                    );
                  }
                }
              }
            }

            if (t.isObjectExpression(props)) {
              const findClassName = props.properties.find(prop =>
                t.isIdentifier(prop.key, { name: 'className' })
              );

              if (findClassName) {
                findClassName.value = t.binaryExpression(
                  '+',
                  t.stringLiteral(`${className} `),
                  findClassName.value
                );
              } else {
                const spreadProps = props.properties.find(p =>
                  t.isSpreadElement(p)
                );

                if (spreadProps) {
                  props.properties.push(
                    t.objectProperty(
                      t.identifier('className'),
                      optionalClassNameOfProps(spreadProps.argument)
                    )
                  );
                } else {
                  props.properties.push(
                    t.objectProperty(
                      t.identifier('className'),
                      t.stringLiteral(className)
                    )
                  );
                }
              }
            }
          },
          JSXOpeningElement(path) {
            const findClassName = path.node.attributes.find(
              attribute => attribute.name && attribute.name.name === 'className'
            );

            if (findClassName) {
              if (t.isJSXExpressionContainer(findClassName.value)) {
                findClassName.value.expression = t.binaryExpression(
                  '+',
                  t.stringLiteral(`${className} `),
                  findClassName.value.expression
                );
              } else {
                if (typeof findClassName.value.value === 'string') {
                  findClassName.value.value = `${className} ${findClassName.value.value}`;
                }
              }

              return;
            }

            const spreadAttr = path.node.attributes.find(attr =>
              t.isJSXSpreadAttribute(attr)
            );

            if (spreadAttr) {
              const classAttribute = t.jsxAttribute(
                t.jsxIdentifier('className'),
                t.jsxExpressionContainer(
                  optionalClassNameOfProps(spreadAttr.argument)
                )
              );
              path.node.attributes.push(classAttribute);
            } else {
              const classAttribute = t.jsxAttribute(
                t.jsxIdentifier('className'),
                t.stringLiteral(`${className}`)
              );
              path.node.attributes.push(classAttribute);
            }
          }
        }
      : {}
  };
};
