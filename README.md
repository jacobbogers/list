
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
	* 1.6. [`count`](#count)
	* 1.7. [`split`](#split)

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

Add an element `item` right after the element pointed to by `list` (`list` is a superset of `item`)

What is returned is the newly added `item` integrated into the list

decl:
```typescript
function insertBefore<T>(list: List<T>, item: Item<T>): List<T>;
```

Example:
```typescript
  let root = from(1); // list with 1 element

  const item2 = insertBefore(root, from(2));
  // "2" will be inserted before "1"
  
  root = item2; // re-asign variable list to the new root of the list
```

###  1.3. <a name='insertBefore'></a>`insertBefore`

###  1.4. <a name='first'></a>`first`

###  1.5. <a name='last'></a>`last`

###  1.6. <a name='count'></a>`count`

###  1.7. <a name='split'></a>`split`



