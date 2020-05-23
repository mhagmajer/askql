import { AskCodeOrValue } from '../../askcode';
import { createElement } from './jsx';
import { AskJSON } from '../../askscript';

export function fromAskScriptAst(ast: AskJSON): AskCodeOrValue {
  if (Array.isArray(ast)) {
    return ast.map(fromAskScriptAst) as any;
  }

  if (ast == null || typeof ast !== 'object') {
    return ast;
  }

  if ('jsxValue' in ast) {
    const object = ast.jsxValue;
    const objectArgs: any[] = [];
    for (const key in object) {
      objectArgs.push(key, fromAskScriptAst(object[key]));
    }

    return createElement('code', { object: true }, ...objectArgs);
  }

  const { name, props, children = [] } = ast;

  // Rewrite properties
  const newProps: Record<string, any> = {};
  for (const key in props) {
    newProps[key] = fromAskScriptAst(props[key]);
  }

  // Rewrite children
  const newChildren = children.map(fromAskScriptAst);

  return createElement(name, newProps, ...newChildren);
}
