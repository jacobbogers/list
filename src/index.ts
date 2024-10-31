export type List<T> = null | {
	prev: List<T>;
	next: List<T>;
	value: T;
};

export type Item<T> = Exclude<List<T>, null>;

export function first<T>(l: List<T>): List<T> {
	return (l?.prev && first(l.prev)) || l;
}

export function last<T>(l: List<T>): List<T> {
	return (l?.next && last(l.next)) || l;
}

export function insertBefore<T>(list: List<T>, item: Item<T>): List<T> {
	item.next = list;
	item.prev = list?.prev ?? null;
	if (item?.prev) {
		item.prev.next = item;
	}
	if (list) {
		list.prev = item;
	}
	return item;
}

export function insertAfter<T>(list: List<T>, item: Item<T>): List<T> {
	item.prev = list;
	item.next = list?.next ?? null;
	if (item?.next) {
		item.next.prev = item;
	}
	if (list) {
		list.next = item;
	}
	return item;
}

export function removeSelf<T>(item: Item<T>): List<T> {
	const temp = item;
	if (temp?.prev) {
		temp.prev.next = temp.next;
	}
	if (temp?.next) {
		temp.next.prev = temp.prev;
	}
	temp.prev = null;
	temp.next = null;
	return temp;
}

export function countFrom<T>(list: List<T>): number {
	let cnt = 0;
	for (let next = list; next !== null; next = next.next) {
		cnt++;
	}
	return cnt;
}

export function toArr<T>(
	list: List<T>,
	take: number = Number.POSITIVE_INFINITY,
): T[] {
	// get length;
	if (list === null) {
		return [];
	}
	const length = countFrom(list);
	const rc = Array.from<T>({ length });
	for (
		let cursor: List<T> = list, cnt = 0;
		cursor !== null && cnt < take;
		cursor = cursor.next, cnt++
	) {
		rc[cnt] = cursor.value;
	}
	return rc;
}

export function from<T>(value: T): Item<T> {
	return { next: null, prev: null, value } as Item<T>;
}

export function value<T>(itm: Item<T>): T {
	return itm.value;
}

export function splice<T>(item: Item<T> | List<T>): List<T> {
	if (item === null) {
		return null;
	}
	const temp = item?.prev;
	item.prev = null;
	if (temp) {
		temp.next = null;
	}
	return item;
}
