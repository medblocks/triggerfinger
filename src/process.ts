import transform from "./transform";
import { Tree } from "./types";

const processSnippets = (tree: Tree): string => {
  const leaf = !tree?.children?.length;
  if (leaf) {
    const html = transform(tree)[0]?.html;
    if (!html) {
      console.warn(`Warning: [${tree.path}] No snippet for ${tree.rmType}`);
      return "";
    }
    return html;
  } else {
    return tree.children.map((child) => child.snippet).join("\n");
  }
};

const processContext = (tree: Tree) => {
  const leaf = !tree?.children?.length;
  if (leaf) {
    if (tree.inContext) {
      return transform(tree)[0]?.html;
    }
  } else {
    const contextSnippet = tree.children
      .filter((child) => child.context)
      .map((child) => child.context);
    if (contextSnippet.length > 0) {
      return contextSnippet.join("\n");
    }
  }
};

const processStatus = (
  tree: Tree,
  paths: string[]
): "present" | "optionalAbsent" | "mandatoryAbsent" | "allPresent" => {
  const leaf = !tree?.children?.length;
  const mandatory = tree.min >= 1;

  const present = paths.indexOf(tree.path) > -1;

  if (leaf && present) {
    return "allPresent";
  }

  if (!present) {
    return mandatory ? "mandatoryAbsent" : "optionalAbsent";
  }
  // Checks for group
  const someChildrenNotPresent = tree.children.some(
    (child) => child.status !== "allPresent"
  );
  if (mandatory) {
    if (!present) {
      return "mandatoryAbsent";
    }
    if (someChildrenNotPresent) {
      if (tree.children.some((child) => child.status === "mandatoryAbsent")) {
        return "mandatoryAbsent";
      } else {
        return "present";
      }
    } else {
      return "allPresent";
    }
  } else {
    if (someChildrenNotPresent) {
      if (tree.children.some((child) => child.status === "mandatoryAbsent")) {
        if (tree.children.some((child) => child.status !== "optionalAbsent")) {
          return "mandatoryAbsent";
        } else {
          return "optionalAbsent";
        }
      } else {
        return "present";
      }
    } else {
      return "allPresent";
    }
  }
};
export const process = (tree: Tree): Tree => {
  const preProcess = (element, parent) => {
    element.path = parent ? `${parent.path}/${element.id}` : element.id;
    element.regex = parent ? `${parent.regex}/${element.id}` : element.id;
    element.runtimeRegex = parent
      ? `${parent.runtimeRegex}/${element.id}`
      : element.id;
    if (element.max === -1 || element.max > 1) {
      element.path = `${element.path}:0`;
      element.runtimeRegex = `${element.runtimeRegex}:(\\d|\\\${.*})`;
      element.regex = `${element.regex}:(\\d)`;
    }
    let node: Tree;
    if (element.children) {
      node = {
        ...element,
        children: element.children.map((child) => preProcess(child, element)),
      };
    } else {
      node = {
        ...element,
      };
    }
    node = {
      ...node,
      //   status: processStatus(node),
      snippet: processSnippets(node),
      context: processContext(node),
    };
    return node;
  };
  const preprocessed = preProcess(tree, null);
  return preprocessed;
};
