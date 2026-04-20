function getAttributes(
  el: Element,
  attributesToIgnore = ["id", "class", "length"]
): string[] {
  const { attributes } = el;
  const attrs = [...attributes];

  return attrs.reduce((sum: string[], next) => {
    if (!(attributesToIgnore.indexOf(next.nodeName) > -1)) {
      sum.push(`[${next.nodeName}="${next.value}"]`);
    }
    return sum;
  }, []);
}

function getClasses(el: Element): string[] {
  if (!el.hasAttribute("class")) {
    return [];
  }

  try {
    let classList = Array.prototype.slice.call(el.classList);

    // return only the valid CSS selectors based on RegEx
    return classList.filter((item) =>
      !/^[a-z_-][a-z\d_-]*$/i.test(item) ? null : item
    );
  } catch (e) {
    let className = el.getAttribute("class") ?? "";

    // remove duplicate and leading/trailing whitespaces
    className = className.trim().replace(/\s+/g, " ");

    // split into separate classnames
    return className.split(" ");
  }
}

function getClassSelectors(el: Element): string[] {
  const classList = getClasses(el).filter(Boolean);
  return classList.map((cl) => `.${cl}`);
}

function kCombinations(
  result: string[],
  items: string[],
  data: string[],
  start: number,
  end: number,
  index: number,
  k: number
) {
  if (index === k) {
    result.push(data.slice(0, index).join(""));
    return;
  }

  for (let i = start; i <= end && end - i + 1 >= k - index; ++i) {
    data[index] = items[i];
    kCombinations(result, items, data, i + 1, end, index + 1, k);
  }
}

function getCombinations(items: string[], k: number): string[] {
  const result: string[] = [],
    n = items.length,
    data: string[] = [];

  for (var l = 1; l <= k; ++l) {
    kCombinations(result, items, data, 0, n - 1, 0, l);
  }

  return result;
}

function getID(el: Element): string | null {
  const id = el.getAttribute("id");

  if (id !== null && id !== "") {
    // if the ID starts with a number or contains ":" selecting with a hash will cause a DOMException
    return id.match(/(?:^\d|:)/) ? `[id="${id}"]` : "#" + id;
  }
  return null;
}

function getNthChild(element: Element): string | null {
  let counter = 0;
  let k;
  let sibling;
  const { parentNode } = element;

  if (Boolean(parentNode)) {
    const { childNodes } = parentNode as ParentNode;
    const len = childNodes.length;
    for (k = 0; k < len; k++) {
      sibling = childNodes[k] as Element;
      if (isElement(sibling)) {
        counter++;
        if (sibling === element) {
          return `:nth-child(${counter})`;
        }
      }
    }
  }
  return null;
}

function getParents(el: Element): Element[] {
  const parents = [];
  let currentElement: any = el;
  while (isElement(currentElement)) {
    parents.push(currentElement);
    currentElement = currentElement.parentNode;
  }

  return parents;
}

function getTag(el: Element): string {
  return el.tagName.toLowerCase().replace(/:/g, "\\:");
}

function getAllSelectors(
  el: Element,
  selectors: string[],
  attributesToIgnore: string[]
): Record<string, string | string[] | null> {
  const funcs: Record<string, (el: Element) => string | string[] | null> = {
    Tag: getTag,
    NthChild: getNthChild,
    Attributes: (elem: Element) => getAttributes(elem, attributesToIgnore),
    Class: getClassSelectors,
    ID: getID,
  };

  return selectors.reduce(
    (res: Record<string, string | string[] | null>, next) => {
      res[next] = funcs[next](el);
      return res;
    },
    {}
  );
}

function testUniqueness(element: Element, selector: string): boolean {
  const { parentNode } = element;
  const elements = parentNode?.querySelectorAll(selector) ?? [];
  return elements.length === 1 && elements[0] === element;
}

function getFirstUnique(element: Element, selectors: string[]): string | null {
  return (
    selectors.find((selector) => testUniqueness(element, selector)) ?? null
  );
}

function getUniqueCombination(
  element: Element,
  items: string[],
  tag: string
): string | null {
  let combinations = getCombinations(items, 3),
    firstUnique = getFirstUnique(element, combinations);

  if (Boolean(firstUnique)) {
    return firstUnique;
  }

  if (Boolean(tag)) {
    combinations = combinations.map((combination) => tag + combination);
    firstUnique = getFirstUnique(element, combinations);

    if (Boolean(firstUnique)) {
      return firstUnique;
    }
  }

  return null;
}

function getUniqueSelector(
  element: Element,
  selectorTypes: string[],
  attributesToIgnore: string[],
  excludeRegex: RegExp | null
): string | null {
  let foundSelector;

  const elementSelectors = getAllSelectors(
    element,
    selectorTypes,
    attributesToIgnore
  );

  if (excludeRegex && excludeRegex instanceof RegExp) {
    elementSelectors.ID = excludeRegex.test(elementSelectors.ID as string)
      ? null
      : elementSelectors.ID;
    elementSelectors.Class = elementSelectors.Class
      ? (elementSelectors.Class as string[]).filter(
          (className) => !excludeRegex.test(className)
        )
      : null;
  }

  for (let selectorType of selectorTypes) {
    const { ID, Tag, Class: Classes, Attributes, NthChild } = elementSelectors;
    switch (selectorType) {
      case "ID":
        if (Boolean(ID) && testUniqueness(element, ID as string)) {
          return ID as string;
        }
        break;

      case "Tag":
        if (Boolean(Tag) && testUniqueness(element, Tag as string)) {
          return Tag as string;
        }
        break;

      case "Class":
        if (Boolean(Classes) && (Classes as string[]).length) {
          foundSelector = getUniqueCombination(
            element,
            Classes as string[],
            Tag as string
          );
          if (foundSelector) {
            return foundSelector;
          }
        }
        break;

      case "Attributes":
        if (Boolean(Attributes) && (Attributes as string[]).length) {
          foundSelector = getUniqueCombination(
            element,
            Attributes as string[],
            Tag as string
          );
          if (foundSelector) {
            return foundSelector;
          }
        }
        break;

      case "NthChild":
        if (Boolean(NthChild)) {
          return NthChild as string;
        }
        break;
    }
  }
  return "*";
}

export function generateSelector(
  el: Element,
  options = {} as {
    selectorTypes?: string[];
    attributesToIgnore?: string[];
    excludeRegex?: RegExp | null;
    scope?: Element;
  }
) {
  const {
    selectorTypes = ["ID", "Class", "Tag", "NthChild"],
    attributesToIgnore = ["id", "class", "length"],
    excludeRegex = null,
    scope,
  } = options;
  const allSelectors = [];
  const parents = getParents(el);

  for (let elem of parents) {
    const selector = getUniqueSelector(
      elem,
      selectorTypes,
      attributesToIgnore,
      excludeRegex
    );
    if (Boolean(selector)) {
      allSelectors.push(selector);
    }
  }

  const selectors = [];
  for (let it of allSelectors) {
    selectors.unshift(it);
    const selector = selectors.join(" > ");
    if (isUnique(el, selector, scope)) {
      return selector;
    }
  }

  return "";
}

function isElement(el: Element | null): el is Element {
  let isElem;

  if (typeof HTMLElement === "object") {
    isElem = el instanceof HTMLElement;
  } else {
    isElem =
      !!el &&
      typeof el === "object" &&
      el.nodeType === 1 &&
      typeof el.nodeName === "string";
  }
  return isElem;
}

function isUnique(
  el: Element,
  selector: string,
  scope?: Element | undefined
): boolean {
  if (!Boolean(selector)) return false;
  const elems = (scope ?? el.ownerDocument).querySelectorAll(selector);
  return elems.length === 1 && elems[0] === el;
}
