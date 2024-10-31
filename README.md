
# List

A double linked list library.
Fast and small no external dependencies

```bash
npm i @mangos/list
```

<!-- vscode-markdown-toc -->
* 1. [API](#API)
	* 1.1. [Utility functions `from` and `value`](#Utilityfunctionsfromandvalue)
		* 1.1.1. [from](#from)
		* 1.1.2. [value](#value)
	* 1.2. [`insertAfter`](#insertAfter)
	* 1.3. [`insertBefore`](#insertBefore)
	* 1.4. [`first`](#first)
	* 1.5. [`last`](#last)
	* 1.6. [`countFrom`](#countFrom)
	* 1.7. [`splice`](#splice)
  * 1.8. [`toArr`](#toArr)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

##  1. <a name='API'></a>API

The linked list (`List<T>`) is a chain of individual items `Item<T>`

An `Item` type is just a narrowed `List` type

The typedecl of an List<T>:

```typescript
type List<T> = null | { // list can have no items, in that case they have the value null
    prev: List<T>;   // prev item in the list
    next: List<T>;   // next item in the list
    value: T; // value wrapped by this list element
};
```

an Element is a a `List<T>` but narrowed, `null` value excluded

```typescript
type Item<T> = Exclude<List<T>, null>;
```

###  1.1. <a name='Utilityfunctionsfromandvalue'></a>Utility functions `from` and `value`

Although  you can create the list js objects manually there are 2 utility functions to help wrap a value in a list item or to extract a value from a list item:

####  1.1.1. <a name='from'></a>from

Wrapping a value in a List item:

```typescript
const item = from({ firstName:'John', lastName: 'Smith' });
// item can be a root of a linked list
```

####  1.1.2. <a name='value'></a>value

Exctracting a value from a list item:

```typescript
const item = from({ firstName: 'John', lastName: 'Smith' });
const actual = value(item);
// -> will return reference to { firstName:'John', lastName: 'Smith' }
```

###  1.2. <a name='insertAfter'></a>`insertAfter`

Peformance: O(1)

Add an element `item` right after the element pointed to by `list` (`list` is a superset of `item`).

What is returned is the newly added `item` integrated into the `list`.

decl:
```typescript
function insertAfter<T>(list: List<T>, item: Item<T>): List<T>;
```

Example:
```typescript
  let root = from(1); // list with 1 element
  insertAfter(root, from(2));
  // "2" will be inserted after "1"
  insertAfter(root, from(3));
  // "3" will be inserted after "1" and before "2"
```

###  1.3. <a name='insertBefore'></a>`insertBefore`

Performance: O(1)

Add an element `item` right before the element pointed to by `list` (`list` is a superset of `item`).

What is returned is the newly added `item` integrated into the `list`.

decl:
```typescript
function insertBefore<T>(list: List<T>, item: Item<T>): List<T>;
```

Example:
```typescript
  const root = from(1); // list with 1 element, root points to element "1"
  const root2 = insertBefore(root, from(2));  // "2" will be before before "1" and become the new root of the list

  // NB: root still points to element "1"
  // NB: root2 points to element "2"
  const elt3 = insertBefore(root, from(3)); // "3" will be  inserted before before "1" and after "2"
```

###  1.4. <a name='first'></a>`first`

Find the first element in a linked list by walking back from the element you passed to `first` function.

Performance: O(n)

decl:
```typescript
function first<T>(list: List<T>): List<T>;
```

Example:
```typescript
let root = from(3);
const obj3 =  root; // remember reference to "3"
root = insertBefore(root, from(2));
root = insertBofere(root, from(1));

const start =  first(obj3);
// start will have the same refere"nce to "1" an as root;

first(null);
// will return null;
```

###  1.5. <a name='last'></a>`last`

Performance: O(n)

Find the last element in a linked list by walking forward from the element you passed to `last` function.

decl:
```typescript
function last<T>(list: List<T>): List<T>;
```

Example:
```typescript
let root = from(3);
root = insertBefore(root, from(2));
const obj2 = root; // keep reference to "root"
root = insertBofere(root, from(1));
const end =  last(obj2);
// end will point to "3"
const end2 = last(root);
// end2 will point to "3"
last(null);
// will return null
```

###  1.6. <a name='countFrom'></a>`countFrom`

Performance: O(n)

Count the number of elements in the linked list **starting from** the position passed as argument to `countFrom`

decl:
```typescript
function countFrom<T>(list: List<T>): number;
```

Example:
```typescript
let root = from(3);
root = insertBefore(root, from(2));
const obj2 = root; // keep reference to "root"
root = insertBofere(root, from(1));

countFrom(root); // will count 3 elements
countFrom(obj2); // will count 2 elements
conntFrom(null); // will count 0 elements
```

###  1.7. <a name='splice'></a>`splice`

Slice a `List` into 2 Lists at the point of `Item` reference.

decl:
```typescript
function splice<T>(item: Item<T> | List<T>): List<T>;
```

1. splits all elements `item` and above to a new list with `item` as the root of the new list.
2. the ref pointed to by `item.prev` will be last item in the previous list.

Example:
```typescript
const root1 = from(1);
const itm2 = from(2);
const itm3 = from(3);
const itm4 = from(4);

insertAfter(root1, itm2);
insertAfter(itm2, itm3);
insertAfter(itm3, itm4);

// now we have a sequence "1" , "2", "3", "4", where "1" is the root

const root2 = splice(itm3);
// root2 will be the sequence "3" , "4"

// root1 will be the sequence "1", "2"
```

###  1.8. <a name='toArr'></a>`toArr`

Convert the List to an javascript Array.

decl:
```typescript
export function toArr<T>(list: List<T>, take: number = Number.POSITIVE_INFINITY ): T[] 
```
`take` is optional second argument, it takes all linked element value's above the list element refeenced by `list`.

Example:

```typescript
const root1 = from(1);
const itm2 = from(2);
const itm3 = from(3);
const itm4 = from(4);

insertAfter(root1, itm2);
insertAfter(itm2, itm3);
insertAfter(itm3, itm4);

// now we have a sequence "1" , "2", "3", "4", where "1" is the root

toArr(root1, 2);
// -> will return array [1,2]

toArr(root1);
// -> will return array [1,2,3,4]

toArr(itm3);
// -> will return array [3,4]
```




