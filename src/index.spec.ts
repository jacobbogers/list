import { describe, it } from "vitest";

import {
	type List,
	first,
	insertAfter,
	insertBefore,
	last,
	removeSelf,
	toArr,
} from "./";

describe("double linked list", () => {
	describe("fidelity", () => {
		it("insertBefore, first [1]", ({ expect }) => {
			const obj1: List<number> = { prev: null, next: null, value: 9 };
			const obj2: List<number> = { prev: null, next: null, value: 3 };
			const v1 = structuredClone(obj1);
			const v2 = structuredClone(obj2);

			const list2 = insertBefore(obj1, obj2);

			// object 2 before object 1
			v1.prev = v2;
			v2.next = v1;
			// check referential integrity
			expect(list2).toBe(obj2);
			expect(list2).toEqual(v2);
			// check reference
			expect(first(obj1)).toBe(obj2);
		});
		it("insertBefore, first, last [2]", ({ expect }) => {
			const obj1: List<number> = {
				prev: null,
				next: null,
				value: 9,
			};
			const obj2: List<number> = {
				prev: null,
				next: null,
				value: 3,
			};
			const obj3: List<number> = {
				prev: null,
				next: null,
				value: 8,
			};
			const v1 = structuredClone(obj1);
			const v2 = structuredClone(obj2);
			const v3 = structuredClone(obj3);

			const list2 = insertBefore(obj1, obj2);
			// [2] <--> [1]
			const list3 = insertBefore(obj1, obj3);
			// [2] <--> [3] <--> [1]

			expect(first(list2)).toBe(list2);
			expect(first(list3)).toBe(list2);

			expect(last(obj1)).toBe(obj1);
			expect(last(list2)).toBe(obj1);

			v1.prev = v3;
			v3.next = v1;
			v3.prev = v2;
			v2.next = v3;

			expect(v2).toEqual(list2);
		});
		it("insertAfter, first, last [1]", ({ expect }) => {
			const obj1: List<number> = {
				prev: null,
				next: null,
				value: 9,
			};
			const obj2: List<number> = {
				prev: null,
				next: null,
				value: 3,
			};
			const obj3: List<number> = {
				prev: null,
				next: null,
				value: 8,
			};

			const last1 = insertAfter(null, obj2); // value order [3]
			// [2]
			expect(last1).toBe(obj2);

			const last2 = insertAfter(last1, obj3); // value order [3,8]
			// [2] <--> [3],

			const last3 = insertAfter(last1, obj1);

			expect(toArr(last1)).toEqual([3, 9, 8]);

			expect(last2).toBe(obj3);
			expect(last3).toBe(obj1);

			expect(last(last1)).toBe(obj3);
		});
		it("removeSelf", ({ expect }) => {
			const obj1: List<number> = {
				prev: null,
				next: null,
				value: 9,
			};
			const obj2: List<number> = {
				prev: null,
				next: null,
				value: 3,
			};
			const obj3: List<number> = {
				prev: null,
				next: null,
				value: 8,
			};

			const ref2 = insertAfter(null, obj2); // value order [3]
			// [2]

			const ref3 = insertAfter(ref2, obj3); // value order [3,8]
			// [2] <--> [3]

			const ref1 = insertAfter(ref2, obj1);
			// [2] <--> [1] <--> [3]

			expect(toArr(ref2)).toEqual([3, 9, 8]);
			expect(ref2).toBe(obj2);
			expect(ref3).toBe(obj3);
			expect(ref1).toBe(obj1);
			expect(last(ref2)).toBe(obj3);

			const removed = removeSelf(obj1);
			// [2] <--> [3]

			expect(removed).toBe(obj1);
			expect(first(ref2)).toBe(ref2);
			expect(last(ref2)).toBe(ref3);

			expect(toArr(ref2)).toEqual([3, 8]);
		});
	});
	describe("errors & edge cases", () => {
		it("empty array count", ({ expect }) => {
			expect(toArr(null)).toEqual([]);
		});
	});
});
